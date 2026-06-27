import { motion } from 'framer-motion'

interface ImageFigureProps {
  src: string
  alt: string
  caption?: string
  fullWidth?: boolean
  className?: string
}

export default function ImageFigure({ src, alt, caption, fullWidth = false, className = '' }: ImageFigureProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <div className="overflow-hidden" style={{ border: '1px solid rgba(30,75,154,0.3)', padding: 16 }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover block"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="font-sans font-semibold tracking-[0.12em] uppercase text-center" style={{ fontSize: 10, color: 'rgba(30,75,154,0.5)', marginTop: 12 }}>
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
