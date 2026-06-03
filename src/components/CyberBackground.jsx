import React, { useEffect, useRef } from 'react'

export default function CyberBackground({ theme }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Respond to resizing
    const handleResize = () => {
      if (!canvasRef.current) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Dynamic color selection based on theme
    const getParticleColor = () => {
      // Return RGB values so we can draw lines with variable opacity
      return theme === 'light' 
        ? { r: 6, g: 124, b: 219 } // Royal Blue
        : { r: 23, g: 190, b: 230 } // Cyber Cyan
    }

    // Limit particles for performance (especially on mobile)
    const particleCount = Math.min(45, Math.floor((width * height) / 35000))

    // Initialize particles
    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.radius = Math.random() * 2 + 1
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx
        if (this.y < 0 || this.y > height) this.vy = -this.vy
      }

      draw() {
        const color = getParticleColor()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Interactive mouse tracking
    let mouse = { x: null, y: null, radius: 120 }
    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Connect particles with lines
    const connect = () => {
      const color = getParticleColor()
      const maxDistance = 100

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            // Fade out lines as particles get further away
            const alpha = (1 - dist / maxDistance) * 0.12
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x
          const dy = particles[i].y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.2
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach(p => {
        p.update()
        p.draw()
      })

      connect()
      animationFrameId = requestAnimationFrame(animate)
    }

    // Optimize CPU with IntersectionObserver: only animate if browser is active
    let observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Start animation loop
              cancelAnimationFrame(animationFrameId)
              animate()
            } else {
              // Pause loop
              cancelAnimationFrame(animationFrameId)
            }
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(canvas)
    } else {
      animate()
    }

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
      if (observer) observer.disconnect()
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.65
      }}
    />
  )
}
