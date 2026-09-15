import ActivityCard from '../components/ActivityCard'
import { countValidActivities, groupActivitiesByWeek, isWeeklyGoalMet } from '../utils/activities'
import { getWeekDebt } from '../utils/debt'
import { formatWeekPeriod, isWeekComplete } from '../utils/week'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function History({ activities }) {
  const today = new Date()
  const weeks = groupActivitiesByWeek(activities, undefined, today)

  return (
    <div>
      <div className="mb-8"><p className="text-sm font-medium text-lime-brand">Sua jornada</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Histórico</h1><p className="mt-3 text-sm text-stone-500">Acompanhe seu desempenho semana a semana.</p></div>
      <div className="space-y-6">{weeks.map((week) => <WeekGroup key={week.weekKey} week={week} today={today} />)}</div>
    </div>
  )
}

function WeekGroup({ week, today }) {
  const validCount = countValidActivities(week.activities)
  const finished = isWeekComplete(week.weekStart, today)
  const met = isWeeklyGoalMet(week.activities)
  const debt = getWeekDebt(week.activities, week.weekStart, today)
  const status = !finished ? 'Em andamento' : met ? 'Cumprida' : 'Não cumprida'

  return (
    <section>
      <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-white/8 bg-panel-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Semana</p><h2 className="mt-1 font-semibold text-white">{formatWeekPeriod(week.weekStart)}</h2></div>
        <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-white/5 px-3 py-1.5 text-stone-300">{validCount} {validCount === 1 ? 'atividade válida' : 'atividades válidas'}</span><span className={`rounded-full px-3 py-1.5 font-semibold ${met ? 'bg-lime-brand/10 text-lime-brand' : finished ? 'bg-red-300/10 text-red-200' : 'bg-amber-300/10 text-amber-100'}`}>{status}</span>{debt > 0 && <span className="rounded-full bg-orange-300/10 px-3 py-1.5 font-semibold text-orange-200">+ {money.format(debt)}</span>}</div>
      </div>
      <div className="grid gap-3">{week.activities.length ? week.activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />) : <div className="rounded-2xl border border-dashed border-white/8 px-5 py-8 text-center text-sm text-stone-600">Nenhuma atividade registrada nesta semana.</div>}</div>
    </section>
  )
}

export default History
