import React, { useState, useEffect, useMemo } from 'react'

export default function Certifications({ onCertsLoaded, addAuditLog, lang, t }) {
  const [certs, setCerts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCert, setSelectedCert] = useState(null)

  // Load certifications database
  useEffect(() => {
    async function loadCertifications() {
      try {
        const response = await fetch('./certifications.json')
        if (!response.ok) throw new Error("Certifications JSON file missing")
        const data = await response.json()
        setCerts(data)
        if (onCertsLoaded) onCertsLoaded(data.length)
      } catch (err) {
        addAuditLog("DATA_ERROR", `Could not load certifications registry: ${err.message}`)
      }
    }
    loadCertifications()
  }, [])

  // Filter categories
  const categories = [
    { key: 'all', label: t('certs_filter_all') },
    { key: 'university', label: t('certs_filter_university') },
    { key: 'iso', label: t('certs_filter_iso') },
    { key: 'cisco', label: t('certs_filter_cisco') },
    { key: 'kpmg', label: t('certs_filter_kpmg') },
    { key: 'coursera', label: t('certs_filter_coursera') },
    { key: 'udemy', label: t('certs_filter_udemy') }
  ]

  // Filtered certifications
  const filteredCerts = useMemo(() => {
    return certs.filter(cert => {
      const matchCategory = activeCategory === 'all' || cert.category === activeCategory
      
      const titleText = lang === 'es' ? cert.title_es : cert.title_en
      const matchSearch = searchQuery === '' || 
        titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchCategory && matchSearch
    })
  }, [certs, activeCategory, searchQuery, lang])

  // Count categories for the chart
  const categoryCounts = useMemo(() => {
    const counts = {
      university: 0,
      iso: 0,
      cisco: 0,
      kpmg: 0,
      coursera: 0,
      udemy: 0
    }
    certs.forEach(cert => {
      if (counts.hasOwnProperty(cert.category)) {
        counts[cert.category]++
      }
    })
    return counts
  }, [certs])

  const maxCount = useMemo(() => {
    return Math.max(...Object.values(categoryCounts)) || 1
  }, [categoryCounts])

  const chartCategories = [
    { key: 'university', color: 'var(--text-primary)' },
    { key: 'iso', color: 'var(--accent-primary)' },
    { key: 'cisco', color: 'var(--accent-tertiary)' },
    { key: 'kpmg', color: 'var(--accent-secondary)' },
    { key: 'coursera', color: '#3b82f6' },
    { key: 'udemy', color: 'var(--accent-warning)' }
  ]

  const handleFilterClick = (catKey) => {
    setActiveCategory(catKey)
    addAuditLog("FILTER", `Certifications filter changed: [${catKey}]`)
  }

  // Safe PDF URI generation
  const getCertPdfUrl = (filename) => {
    if (!filename) return ''
    return `./Certificaciones/${encodeURIComponent(filename)}`
  }

  return (
    <section id="certs" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_certs')}</span>
          <h2 className="section-title">{t('certs_title')}</h2>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-wrapper">
          <div className="search-box glass-card">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder={t('certs_search_placeholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="cert-search-input" 
            />
          </div>
          <div className="filters-container">
            {categories.map(cat => (
              <button 
                key={cat.key} 
                className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => handleFilterClick(cat.key)}
                data-filter={cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Certification Grid */}
        <div className="certifications-grid" id="certifications-grid">
          {filteredCerts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              No certifications found matching the criteria.
            </div>
          ) : (
            filteredCerts.map(cert => (
              <div 
                className={`cert-card glass-card ${cert.category}`} 
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
              >
                <span className="cert-category-badge">{t(`certs_filter_${cert.category}`)}</span>
                <h3>{lang === 'es' ? cert.title_es : cert.title_en}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <div className="cert-footer">
                  <span>{cert.date}</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {t('certs_view_btn')} &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="certs-analytics glass-card">
          <h3>{t('certs_stats_title')}</h3>
          <div className="certs-chart-container" id="certs-chart-container">
            {chartCategories.map(cat => {
              const count = categoryCounts[cat.key] || 0
              const percent = (count / maxCount) * 100
              const displayName = t(`certs_filter_${cat.key}`)

              return (
                <div key={cat.key} className="chart-bar-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{displayName}</span>
                    <span style={{ color: cat.color, fontWeight: '700' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div 
                      className="chart-progress-bar" 
                      style={{ 
                        width: `${percent}%`, 
                        height: '100%', 
                        background: cat.color, 
                        borderRadius: '4px', 
                        transition: 'width 1s ease-out' 
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* React Modal Details */}
      {selectedCert && (
        <div className="modal-overlay active" onClick={() => setSelectedCert(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCert(null)}>&times;</button>
            <div className="modal-header">
              <span className="cert-category-badge">{t(`certs_filter_${selectedCert.category}`)}</span>
              <h2>{lang === 'es' ? selectedCert.title_es : selectedCert.title_en}</h2>
              <p className="modal-issuer-row"><b>{t('modal_issuer')}:</b> {selectedCert.issuer}</p>
            </div>
            <div className="modal-body-content">
              <p className="modal-meta-row"><b>{t('modal_date')}:</b> {selectedCert.date}</p>
              <div className="modal-skills-box">
                <h4>{t('certs_skills_label')}:</h4>
                <div className="modal-skills-tags">
                  {selectedCert.skills.map((skill, idx) => (
                    <span className="skill-tag-small" key={idx}>{skill}</span>
                  ))}
                </div>
              </div>
              {selectedCert.filename && (
                <div className="modal-evidence-box">
                  <h4>{t('certs_file_label')}:</h4>
                  <a 
                    href={getCertPdfUrl(selectedCert.filename)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    Ver Certificado Oficial
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
