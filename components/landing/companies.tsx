export default function Companies() {
  const companies = [
    { name: "SECLOCK", color: "text-muted-foreground" },
    { name: "software", color: "text-muted-foreground" },
    { name: "omni", color: "text-muted-foreground" },
    { name: "CAMBRIAN", color: "text-muted-foreground" },
    { name: "DocuSign", color: "text-muted-foreground" },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-t border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
            Trusted by Companies All Over the World
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div key={company.name} className="text-lg sm:text-xl font-semibold text-muted-foreground">
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
