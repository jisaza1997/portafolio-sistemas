import React, { useState, useEffect } from 'react'

export default function GitHubSection({ addAuditLog, t }) {
  const [repos, setRepos] = useState([])
  const [stats, setStats] = useState({ publicRepos: 12, followers: 18 }) // Good realistic defaults
  const [loading, setLoading] = useState(true)

  const username = "jisaza1997"

  const getLanguageColor = (lang) => {
    const colors = {
      "Python": "#3572A5",
      "JavaScript": "#f1e05a",
      "HTML": "#e34c26",
      "CSS": "#563d7c",
      "Shell": "#89e051",
      "Go": "#00ADD8",
      "Java": "#b07219"
    }
    return colors[lang] || "#8b949e"
  }

  const fallbacks = [
    {
      name: "backend-security-checks",
      html_url: `https://github.com/${username}/backend-security-checks`,
      description: "Middleware tools for auditing OWASP configurations and token validations in Python/Flask backend applications.",
      language: "Python",
      stargazers_count: 3
    },
    {
      name: "db-audit-tool",
      html_url: `https://github.com/${username}/db-audit-tool`,
      description: "Database schema compliance verifier. Scans structures to confirm segregation of duties (SoD) compliance.",
      language: "Go",
      stargazers_count: 2
    }
  ]

  useEffect(() => {
    async function fetchGitHubData() {
      const profileUrl = `https://api.github.com/users/${username}`
      const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`

      try {
        addAuditLog("API_CALL", `Connecting to GitHub API for user [${username}]...`)
        const profileRes = await fetch(profileUrl)
        if (!profileRes.ok) throw new Error("GitHub profile fetch failed")
        const profileData = await profileRes.json()
        
        setStats({
          publicRepos: profileData.public_repos,
          followers: profileData.followers
        })
        addAuditLog("API_SUCCESS", `GitHub profile parsed successfully. Public repos: ${profileData.public_repos}`)

        const reposRes = await fetch(reposUrl)
        if (!reposRes.ok) throw new Error("GitHub repos fetch failed")
        const reposData = await reposRes.json()
        
        // Filter out the main kpmg-report-manager (displayed statically below) and get first 4
        const filtered = reposData.filter(repo => repo.name !== "kpmg-report-manager").slice(0, 4)
        setRepos(filtered)
        setLoading(false)
      } catch (err) {
        addAuditLog("API_ERROR", `Failed to query GitHub API: ${err.message}. Loading offline fallback cache.`)
        setRepos(fallbacks)
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_projects')}</span>
          <h2 className="section-title">{t('github_title')}</h2>
        </div>
        
        {/* GitHub Stats Panel */}
        <div className="github-stats-container">
          <div className="stat-card glass-card">
            <span className="stat-num" id="github-repos-count">{stats.publicRepos}</span>
            <span className="stat-label">{t('github_repos')}</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-num" id="github-followers-count">{stats.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
        </div>

        {/* Repos Grid */}
        <div className="github-grid">
          {/* Featured Project: KPMG Report Manager (Static highlight) */}
          <div className="featured-project-card glass-card">
            <div className="featured-badge">{t('github_featured')}</div>
            <div className="project-header">
              <svg className="folder" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <div className="project-links">
                <a href={`https://github.com/${username}/kpmg-report-manager`} target="_blank" rel="noopener noreferrer" aria-label="Visit project code">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
            <h3>kpmg-report-manager</h3>
            <p>{t('github_featured_desc')}</p>
            <div className="project-footer">
              <div className="project-lang">
                <span className="lang-dot" style={{ backgroundColor: '#3572A5' }}></span>
                <span>Python / Pandas</span>
              </div>
              <div className="featured-meta">
                <span>IT Audit Tool</span>
              </div>
            </div>
          </div>

          {/* Dynamic Repos Grid */}
          <div className="github-repos-grid-wrapper">
            <div className="github-repos-grid" id="github-repos-grid">
              {repos.map(repo => (
                <div className="project-card glass-card" key={repo.name}>
                  <div className="project-header">
                    <svg className="folder" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div className="project-links">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label="Github repository link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || "No description provided."}</p>
                  <div className="project-footer">
                    <div className="project-lang">
                      <span className="lang-dot" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                      <span>{repo.language || "Markdown"}</span>
                    </div>
                    <span>★ {repo.stargazers_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
