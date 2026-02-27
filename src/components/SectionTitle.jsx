export default function SectionTitle({ title }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mx-auto mt-2 h-1 w-12 rounded bg-primary" />
    </div>
  )
}
