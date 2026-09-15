import { Icon } from './Icons'

function StatsCard({ icon, label, value, detail, accent = false }) {
  return (
    <article className="rounded-2xl border border-white/8 bg-panel p-5">
      <div className={`mb-5 grid h-10 w-10 place-items-center rounded-xl ${accent ? 'bg-lime-brand text-[#0b100c]' : 'bg-white/5 text-stone-300'}`}><Icon name={icon} className="h-5 w-5" /></div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-stone-500">{detail}</p>}
    </article>
  )
}

export default StatsCard
