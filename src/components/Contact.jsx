import React, { useState } from 'react'

export default function Contact({ addAuditLog, t }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    addAuditLog("FORM_SUBMIT", `Secure contact request submitted by: [${formData.name}] <${formData.email}>`)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_contact')}</span>
          <h2 className="section-title">{t('contact_title')}</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info glass-card">
            <h3>{t('contact_card_title')}</h3>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:julianandresisazaarias7@gmail.com">julianandresisazaarias7@gmail.com</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h4>{lang => 'Teléfono'}Teléfono</h4>
                  <p>+57 311 8287430</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper glass-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="form-name">{t('contact_name_label')}</label>
                <input 
                  type="text" 
                  name="name"
                  id="form-name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="form-email">{t('contact_email_label')}</label>
                <input 
                  type="email" 
                  name="email"
                  id="form-email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="form-msg">{t('contact_msg_label')}</label>
                <textarea 
                  name="message"
                  id="form-msg" 
                  rows="5" 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                {t('contact_send_btn')}
              </button>

              {submitted && (
                <div className="form-success-alert" style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-secondary)', borderRadius: '8px', border: '1px solid var(--accent-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  {t('contact_success')}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
