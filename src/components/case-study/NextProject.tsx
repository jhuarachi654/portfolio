import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface NextProjectProps {
  title: string
  to: string
  description?: string
  image?: string
}

export default function NextProject({ title, to, description, image }: NextProjectProps) {
  return (
    <div style={{ paddingLeft: 32, paddingRight: 32, marginTop: 84 }}>
      <section
        className="max-w-[1080px] px-8 md:px-14"
        style={{
          borderTop: '1px solid rgba(30,75,154,0.2)',
          paddingTop: 48,
          paddingBottom: 84,
        }}
      >
        <p className="font-sans font-semibold tracking-[0.14em] uppercase text-navy/50" style={{ fontSize: 13, marginBottom: 16 }}>
          Next Project
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: image ? '1fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
            <Link to={to} data-cursor-label="Open case study" className="group inline-block">
              <h2 className="font-bold text-navy" style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1.1, margin: '0 0 12px' }}>
                {title} <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              </h2>
              {description && (
                <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-secondary)', maxWidth: 480, margin: 0 }}>
                  {description}
                </p>
              )}
            </Link>
          </motion.div>

          {image && (
            <Link to={to} tabIndex={-1} style={{ display: 'block' }}>
              <div style={{
                background: 'rgba(30,75,154,0.05)',
                border: '1px solid rgba(30,75,154,0.15)',
                padding: 24,
                overflow: 'hidden',
              }}>
                <img
                  src={image}
                  alt={title}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
