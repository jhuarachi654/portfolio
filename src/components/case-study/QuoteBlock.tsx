interface QuoteBlockProps {
  quote: string
  attribution?: string
}

export default function QuoteBlock({ quote, attribution }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-2 border-teal pl-6 py-2 my-8">
      <p className="font-serif text-[18px] sm:text-[20px] font-semibold text-navy leading-relaxed italic">
        "{quote}"
      </p>
      {attribution && (
        <cite className="block font-sans text-[12px] text-secondary not-italic mt-3 tracking-wide">
          — {attribution}
        </cite>
      )}
    </blockquote>
  )
}
