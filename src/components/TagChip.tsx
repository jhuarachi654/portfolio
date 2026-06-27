interface TagChipProps {
  label: string
  variant?: 'outline' | 'teal' | 'navy'
}

export default function TagChip({ label, variant = 'outline' }: TagChipProps) {
  const styles = {
    outline: 'border border-[rgba(30,75,154,0.2)] text-navy/70 bg-transparent',
    teal: 'border border-teal/30 text-teal bg-teal-tint',
    navy: 'border border-navy text-white bg-navy',
  }

  return (
    <span
      className={`inline-block font-sans text-[11px] font-medium px-2.5 py-1 tracking-wide ${styles[variant]}`}
      style={{ borderRadius: 0 }}
    >
      {label}
    </span>
  )
}
