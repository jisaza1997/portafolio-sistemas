import React, { useState, useEffect, useMemo } from 'react'

export default function Certifications({ onCertsLoaded, addAuditLog, lang, t }) {
  const [certs, setCerts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredSegment, setHoveredSegment] = useState(null)
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

  const totalCertsCount = useMemo(() => {
    return Object.values(categoryCounts).reduce((a, b) => a + b, 0)
  }, [categoryCounts])

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

  const chartSegments = useMemo(() => {
    let accumulatedPercent = 0
    const circumference = 2 * Math.PI * 55 // radius = 55

    return chartCategories.map(cat => {
      const count = categoryCounts[cat.key] || 0
      const percent = totalCertsCount > 0 ? (count / totalCertsCount) : 0
      const strokeLength = percent * circumference
      const strokeOffset = circumference - (accumulatedPercent * circumference)
      
      accumulatedPercent += percent

      return {
        ...cat,
        count,
        percent: Math.round(percent * 100),
        strokeLength,
        strokeOffset,
        circumference,
        displayName: t(`certs_filter_${cat.key}`)
      }
    }).filter(seg => seg.count > 0)
  }, [categoryCounts, totalCertsCount, lang])

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
    <section id="certifications" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_certs')}</span>
          <h2 className="section-title">{t('certs_title')}</h2>
        </div>

        {/* Search and Filters */}
        <div className="certs-controls">
          <div className="certs-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div className="certs-filters">
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
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600', display: 'inline-flex', alignParagraphs: 'center', gap: '4px' }}>
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
          <div className="certs-chart-wrapper">
            {/* SVG Doughnut Chart */}
            <div className="doughnut-chart-visual">
              <svg width="100%" height="100%" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background track */}
                <circle cx="80" cy="80" r="55" fill="transparent" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="16" />
                {/* Segments */}
                {chartSegments.map((seg) => {
                  const isHovered = hoveredSegment && hoveredSegment.key === seg.key;
                  return (
                    <circle
                      key={seg.key}
                      cx="80"
                      cy="80"
                      r="55"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 20 : 16}
                      strokeDasharray={`${seg.strokeLength} ${seg.circumference}`}
                      strokeDashoffset={seg.strokeOffset}
                      strokeLinecap="round"
                      style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredSegment(seg)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onClick={() => handleFilterClick(seg.key)}
                    />
                  );
                })}
              </svg>
              {/* Dynamic center text */}
              <div className="doughnut-center-text">
                <span className="doughnut-center-label">
                  {hoveredSegment ? hoveredSegment.displayName : (lang === 'es' ? 'Total' : 'Total')}
                </span>
                <span className="doughnut-center-value" style={{ color: hoveredSegment ? hoveredSegment.color : 'var(--text-primary)' }}>
                  {hoveredSegment ? hoveredSegment.count : totalCertsCount}
                </span>
              </div>
            </div>

            {/* Legend / Progress Bars list */}
            <div className="certs-chart-legend">
              {chartCategories.map(cat => {
                const count = categoryCounts[cat.key] || 0
                const percent = totalCertsCount > 0 ? (count / totalCertsCount) * 100 : 0
                const displayName = t(`certs_filter_${cat.key}`)
                const isHovered = hoveredSegment && hoveredSegment.key === cat.key;

                return (
                  <div 
                    key={cat.key} 
                    className={`chart-bar-wrapper ${isHovered ? 'hovered' : ''} ${hoveredSegment && !isHovered ? 'dimmed' : ''}`}
                    onMouseEnter={() => {
                      const seg = chartSegments.find(s => s.key === cat.key)
                      if (seg) setHoveredSegment(seg)
                    }}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => handleFilterClick(cat.key)}
                  >
                    <div className="legend-label-row">
                      <span className="legend-name">{displayName}</span>
                      <span className="legend-count" style={{ color: cat.color }}>{count}</span>
                    </div>
                    <div className="legend-progress-track">
                      <div 
                        className="chart-progress-bar" 
                        style={{ 
                          width: `${percent}%`, 
                          height: '100%', 
                          background: cat.color, 
                          borderRadius: '3px', 
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
      </div>

      {/* Modal Details matching original structure */}
      <div className={`modal ${selectedCert ? 'active' : ''}`} id="cert-modal" onClick={() => setSelectedCert(null)}>
        {selectedCert && (
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCert(null)} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="modal-header">
              <h3 id="modal-cert-title">{lang === 'es' ? selectedCert.title_es : selectedCert.title_en}</h3>
              <p id="modal-cert-issuer" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{selectedCert.issuer}</p>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <h5 data-i18n="modal_date">{t('modal_date')}</h5>
                  <p id="modal-cert-date">{selectedCert.date}</p>
                </div>
                <div className="modal-info-item">
                  <h5 data-i18n="modal_verification">{t('modal_verification')}</h5>
                  <p id="modal-cert-file" style={{ wordBreak: 'break-all' }}>{selectedCert.filename || "Verified PDF Ledger"}</p>
                </div>
              </div>
              
              <div className="modal-skills">
                <h5 data-i18n="certs_skills_label">{t('certs_skills_label')}</h5>
                <div className="modal-skills-list" id="modal-cert-skills">
                  {selectedCert.skills.map((skill, idx) => (
                    <span className="badge" key={idx}>{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="modal-btn-wrapper" style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                {selectedCert.filename ? (
                  <a 
                    id="modal-cert-download-link" 
                    href={getCertPdfUrl(selectedCert.filename)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.9rem', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    <span id="modal-view-doc-text">{t('certs_file_label') === 'Evidencia de Archivo' ? 'Ver Documento' : 'View Document'}</span>
                  </a>
                ) : null}
                <button 
                  className="btn btn-secondary modal-close" 
                  style={{ flex: 1, fontSize: '0.9rem', padding: '10px 16px' }} 
                  onClick={() => setSelectedCert(null)}
                  data-i18n="modal_close_btn"
                >
                  {t('modal_close_btn')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
