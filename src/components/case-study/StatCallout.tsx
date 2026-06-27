interface StatCalloutProps {
  stat: string
  description: string
  accent?: boolean
}

export default function StatCallout({ stat, description, accent = false }: StatCalloutProps) {
  return (
    <div className={`p-8 border ${accent ? 'border-teal/30 bg-teal-tint' : 'border-[rgba(30,75,154,0.12)] bg-paper'}`}>
      <p className="font-serif text-[56px] sm:text-[72px] font-bold text-navy leading-none mb-3">
        {stat}
      </p>
      <p className="font-sans text-[14px] text-navy/70 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
