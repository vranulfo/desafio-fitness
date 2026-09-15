import { Link } from 'react-router-dom'
import ActivityCard from '../components/ActivityCard'
import DebtCard from '../components/DebtCard'
import { Icon } from '../components/Icons'
import StatsCard from '../components/StatsCard'
import WeeklyProgress from '../components/WeeklyProgress'
import { WEEKLY_GOAL } from '../data/initialData'
import { countValidActivities, getActivitiesForWeek } from '../utils/activities'
import { calculateDebt, getChallengeStats } from '../utils/debt'
import { formatWeekPeriod } from '../utils/week'

function Dashboard({ activities }) {
  const today = new Date()
  const currentActivities = getActivitiesForWeek(activities, today)
  const currentValidCount = countValidActivities(currentActivities)
  const stats = getChallengeStats(activities, today)
  const recentActivities = [...activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const goalMet = currentValidCount >= WEEKLY_GOAL

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex items-center gap-3 sm:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-brand text-[#0b100c]"><Icon name="activity" /></span><span className="font-semibold">Desafio Fitness</span></div>
          <p className="text-sm font-medium text-lime-brand">Seu painel</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Continue em movimento.</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-stone-500"><Icon name="calendar" className="h-4 w-4" />Semana de {formatWeekPeriod(today)}</p>
        </div>
        <Link to="/nova-atividade" className="hidden items-center gap-2 rounded-xl bg-lime-brand px-4 py-3 text-sm font-bold text-[#0b100c] transition hover:bg-[#d8ff70] sm:flex"><Icon name="plus" className="h-4 w-4" />Registrar atividade</Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <WeeklyProgress value={currentValidCount} />
        <div className="grid grid-cols-2 gap-4">
          <DebtCard value={calculateDebt(activities, today)} />
          <StatsCard icon="check" label="Status da semana" value={goalMet ? 'Cumprida' : 'Em andamento'} detail={goalMet ? 'Meta alcançada' : 'Prazo até domingo'} accent={goalMet} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatsCard icon="calendar" label="Semanas cumpridas" value={stats.completedWeeks} />
        <StatsCard icon="flame" label="Sequência atual" value={`${stats.currentStreak} ${stats.currentStreak === 1 ? 'semana' : 'semanas'}`} />
        <div className="col-span-2 sm:col-span-1"><StatsCard icon="activity" label="Atividades válidas" value={stats.totalValidActivities} detail="Desde o início do desafio" /></div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Atividade recente</p><h2 className="mt-1 text-xl font-bold text-white">Últimos registros</h2></div><Link to="/historico" className="flex items-center gap-1 text-sm font-medium text-lime-brand hover:underline">Ver histórico <Icon name="chevron" className="h-4 w-4" /></Link></div>
        <div className="grid gap-3">{recentActivities.length ? recentActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} compact />) : <EmptyState />}</div>
      </section>
    </div>
  )
}

function EmptyState() {
  return <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-stone-500">Nenhuma atividade registrada ainda.</div>
}

export default Dashboard
