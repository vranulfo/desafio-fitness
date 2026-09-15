import { Icon } from './Icons'

function DebtCard({ value }) {
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  return <StatsCard icon="wallet" label="Dívida acumulada" value={formatted} detail="Inclui saldo inicial de R$ 5,00" />
}

function StatsCard({ icon, label, value, detail }) {
  return (
    <article className="rounded-2xl border border-orange-300/10 bg-gradient-to-br from-[#1a1712] to-panel p-5">
      <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-orange-300/10 text-orange-200"><Icon name={icon} className="h-5 w-5" /></div>
      <p className="text-sm text-stone-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p><p className="mt-1 text-xs text-stone-500">{detail}</p>
    </article>
  )
}

export default DebtCard
