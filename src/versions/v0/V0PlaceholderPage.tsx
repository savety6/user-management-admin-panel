interface V0PlaceholderPageProps {
  title: string
  description: string
}

export default function V0PlaceholderPage({ title, description }: V0PlaceholderPageProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="v0-placeholder text-center">
        <h2 className="mb-1.5 text-[18px] font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-[13.5px] text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
