import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TagChip from '../TagChip'

interface MetaItem {
  label: string
  value: string | string[]
}

interface CaseStudyHeroProps {
  title: string
  description: string
  meta: MetaItem[]
  tags?: string[]
  coverImage?: string
  coverAlt?: string
}

export default function CaseStudyHero({
  title,
  description,
  meta,
  tags = [],
  coverImage,
  coverAlt,
}: CaseStudyHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="pt-28 pb-16 max-w-[1200px] mx-auto px-5"
    >
      <Link
        to="/work"
        className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-secondary hover:text-navy transition-colors mb-10 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        All work
      </Link>

      <div className="max-w-[760px]">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map(t => <TagChip key={t} label={t} />)}
          </div>
        )}

        <h1 className="font-serif text-[40px] sm:text-[52px] font-bold text-navy leading-[1.15] mb-5">
          {title}
        </h1>

        <p className="font-sans text-[17px] text-navy/70 leading-relaxed mb-10 max-w-[600px]">
          {description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 pt-8 border-t border-[rgba(30,75,154,0.12)]">
          {meta.map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary mb-1.5">
                {label}
              </p>
              {Array.isArray(value) ? (
                <ul className="space-y-0.5">
                  {value.map(v => (
                    <li key={v} className="font-sans text-[13px] text-navy font-medium">{v}</li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-[13px] text-navy font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {coverImage && (
        <div className="mt-14 w-full overflow-hidden bg-[#f5f5f5]">
          <img
            src={coverImage}
            alt={coverAlt ?? title}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      )}
    </motion.section>
  )
}
