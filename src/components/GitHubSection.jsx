import React, { useState, useEffect } from 'react'

export default function GitHubSection({ addAuditLog, t }) {
  const [repos, setRepos] = useState([])
  const [stats, setStats] = useState({ publicRepos: 1, followers: 0 }) // Good realistic defaults
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
      name: "portafolio-sistemas",
      html_url: `https://github.com/${username}/portafolio-sistemas`,
      description: "Portafolio interactivo de Auditoría de TI e Ingeniería de Sistemas. Integra tableros de control de automatización de scripts e ISO 27001.",
      language: "JavaScript",
      stargazers_count: 1
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
    <section id="github-section" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_projects')}</span>
          <h2 className="section-title">{t('github_title')}</h2>
        </div>
        
        {/* GitHub Stats Panel */}
        <div className="github-stats-container">
          <div className="github-stat-card glass-card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <h4 id="github-repos-count">{stats.publicRepos}</h4>
            <p>{t('github_repos')}</p>
          </div>
          <div className="github-stat-card glass-card">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h4 id="github-followers-count">{stats.followers}</h4>
            <p>{t('nav_about') === 'Sobre Mí' ? 'Seguidores / Contactos' : 'Followers / Contacts'}</p>
          </div>
        </div>

        {/* Repos Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Featured Project */}
          <div className="project-card glass-card featured" style={{ position: 'relative' }}>
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

          {/* Private Projects Title */}
          <div style={{ marginTop: '32px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              {t('private_projects_title')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(239, 68, 68, 0.05)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)', lineHeight: 1.4 }}>
              {t('private_projects_note')}
            </p>
          </div>

          {/* Private Projects Grid */}
          <div className="projects-grid" style={{ marginBottom: '32px' }}>
            {Array.isArray(t('private_projects')) && t('private_projects').map((proj, idx) => (
              <div className="project-card glass-card" key={idx}>
                <div className="project-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" style={{ color: 'var(--accent-secondary)' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <div className="project-links">
                    <a href="#contact" className="badge" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 600 }}>
                      {t('private_project_demo_btn')} &rarr;
                    </a>
                  </div>
                </div>
                <h3>{proj.name}</h3>
                <p>{proj.desc}</p>
                <div className="project-footer">
                  <div className="project-lang">
                    <span className="lang-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                    <span>{proj.tech}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{proj.visual}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Repos Title */}
          <h3 style={{ fontSize: '1.4rem', marginTop: '20px', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
            {t('github_public_title')}
          </h3>

          {/* Dynamic Repos */}
          <div className="projects-grid" id="github-repos-grid">
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
    </section>
  )
}
