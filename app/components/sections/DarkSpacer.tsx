export default function DarkSpacer() {
  return (
    <section className="relative bg-black h-[250px] lg:h-[350px] border-t border-border">
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
        <div className="border-r border-border/20 h-full" />
        <div className="border-r border-border/20 h-full" />
        <div className="h-full" />
      </div>
      <div className="absolute top-0 right-0 w-[140px] lg:w-[200px] h-full max-h-[300px] border-l border-b border-border/30" />
    </section>
  )
}
