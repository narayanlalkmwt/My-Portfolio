// github-dashboard.js
// Safe for GitHub Pages (NO API KEY REQUIRED)

const GITHUB_USERNAME = 'narayanlalkmwt';
const dashboardContainer = document.getElementById('github-dashboard-content');

async function fetchGitHubData() {
  if (!dashboardContainer) return;

  dashboardContainer.innerHTML = '<p>Loading your GitHub stats...</p>';

  try {
    // Fetch user profile (public)
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!userRes.ok) throw new Error('User fetch failed');
    const user = await userRes.json();

    // Fetch repositories (public)
    const repoRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    );
    if (!repoRes.ok) throw new Error('Repo fetch failed');
    const repos = await repoRes.json();

    // Calculate total stars and forks
    let stars = 0;
    let forks = 0;

    repos.forEach(repo => {
      stars += repo.stargazers_count || 0;
      forks += repo.forks_count || 0;
    });

    // Sort repositories by stars
    const topRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    // Build dashboard HTML
    dashboardContainer.innerHTML = `
      <div class="github-profile">
        <img src="${user.avatar_url}" alt="${user.login}" class="github-avatar" />
        <div>
          <h3>
            <a href="${user.html_url}" target="_blank" rel="noopener">
              ${user.name || user.login}
            </a>
          </h3>
          <p>${user.bio || ''}</p>
          <p>
            <b>Followers:</b> ${user.followers}
            &nbsp; | &nbsp;
            <b>Following:</b> ${user.following}
          </p>
          <p>
            <b>Public Repos:</b> ${user.public_repos}
            &nbsp; | &nbsp;
            <b>Total Stars:</b> ${stars}
            &nbsp; | &nbsp;
            <b>Total Forks:</b> ${forks}
          </p>
        </div>
      </div>

      <div class="github-repos">
        <h4>Top Repositories</h4>
        <div class="github-repo-cards">
          ${topRepos.map(repo => `
            <div class="github-repo-card systematic">
              <div class="repo-header">
                <div class="repo-avatar-title">
                  <img
                    src="${user.avatar_url}"
                    alt="${user.login}"
                    class="repo-owner-avatar"
                  />
                  <div>
                    <a
                      href="${repo.html_url}"
                      target="_blank"
                      rel="noopener"
                      class="repo-title"
                    >
                      ${repo.name}
                    </a>
                    <div class="repo-owner">by ${user.login}</div>
                  </div>
                </div>
                ${repo.language ? `<span class="repo-lang-badge">${repo.language}</span>` : ''}
              </div>

              <div class="repo-desc">
                ${repo.description || '<em>No description</em>'}
              </div>

              <div class="repo-stats-badges">
                <span class="repo-badge star">★ ${repo.stargazers_count}</span>
                <span class="repo-badge fork">🍴 ${repo.forks_count}</span>
                <span class="repo-badge update">
                  🕒 ${new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    dashboardContainer.innerHTML =
      '<p>Unable to load GitHub data at the moment. Please try again later.</p>';
  }
}

// Run on load
fetchGitHubData();
