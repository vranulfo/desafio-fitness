import { getActivityLabel } from '../constants/activityTypes'
import { doesActivityCount } from '../utils/activities'
import { formatDate } from '../utils/week'
import { Icon } from './Icons'

function ActivityCard({ activity, compact = false }) {
  const counts = doesActivityCount(activity)
  return (
    <article className="flex gap-4 rounded-2xl border border-white/7 bg-panel p-4 sm:p-5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${counts ? 'bg-lime-brand/10 text-lime-brand' : 'bg-white/5 text-stone-500'}`}><Icon name="activity" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div><h3 className="font-semibold text-white">{getActivityLabel(activity)}</h3><p className="mt-1 text-sm text-stone-500">{formatDate(activity.date)}{activity.duration ? ` · ${activity.duration} min` : ''}</p></div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${counts ? 'bg-lime-brand/10 text-lime-brand' : 'bg-white/5 text-stone-400'}`}>{counts ? 'Conta para a meta' : 'Não conta'}</span>
        </div>
        {!compact && activity.note && <p className="mt-3 text-sm leading-6 text-stone-400">{activity.note}</p>}
        {!compact && activity.signedPhotoUrl && (
          <a href={activity.signedPhotoUrl} target="_blank" rel="noreferrer" className="mt-4 block w-fit overflow-hidden rounded-xl border border-white/10 transition hover:border-lime-brand/30">
            <img src={activity.signedPhotoUrl} alt={`Comprovação de ${getActivityLabel(activity)}`} className="h-28 w-40 object-cover" loading="lazy" />
          </a>
        )}
        {!compact && <div className="mt-3 flex items-center gap-2 text-xs text-stone-500"><Icon name="image" className="h-4 w-4" />{getProofLabel(activity)}</div>}
      </div>
    </article>
  )
}

function getProofLabel(activity) {
  if (activity.proofStatus === 'external') return 'Comprovação enviada pelo WhatsApp'
  if (activity.signedPhotoUrl) return 'Foto armazenada com acesso privado'
  if (activity.photoPath) return 'Foto privada temporariamente indisponível'
  return 'Sem comprovação disponível'
}

export default ActivityCard
