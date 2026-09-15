import { WEEKLY_GOAL } from '../data/initialData'

function WeeklyProgress({ value }) {
  const displayedValue = Math.min(value, WEEKLY_GOAL)
  const percentage = (displayedValue / WEEKLY_GOAL) * 100
  const remaining = Math.max(WEEKLY_GOAL - value, 0)

  return (
    <section className="overflow-hidden rounded-3xl border border-lime-brand/15 bg-gradient-to-br from-[#172119] to-[#0f1612] p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-brand">Meta semanal</p>
          <div className="mt-3 flex items-end gap-2">
            <strong className="text-5xl font-bold tracking-[-0.06em] text-white sm:text-6xl">{value}</strong>
            <span className="pb-1 text-xl font-medium text-stone-500">/ {WEEKLY_GOAL}</span>
          </div>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-full border border-lime-brand/20 bg-lime-brand/8 text-sm font-bold text-lime-brand">{Math.round(percentage)}%</div>
      </div>
      <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-lime-brand transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-4 text-sm text-stone-300">
        {remaining > 0 ? <><span className="font-semibold text-white">Faltam {remaining}</span> {remaining === 1 ? 'atividade' : 'atividades'} para fechar a semana.</> : <span className="font-semibold text-lime-brand">Meta concluída. Continue no ritmo!</span>}
      </p>
    </section>
  )
}

export default WeeklyProgress
