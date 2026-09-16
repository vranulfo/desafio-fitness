import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACTIVITY_TYPES, getActivityType } from '../constants/activityTypes'
import { doesActivityCount } from '../utils/activities'
import { toDateKey } from '../utils/week'
import { Icon } from '../components/Icons'

const INITIAL_FORM = { type: '', date: toDateKey(new Date()), duration: '', customType: '', note: '', proof: null }
const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-lime-brand/60 focus:ring-2 focus:ring-lime-brand/10'

function NewActivity({ onAddActivity }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const selectedType = getActivityType(form.type)
  const previewActivity = { type: form.type, duration: form.duration }
  const counts = doesActivityCount(previewActivity)

  function updateField(event) {
    const { name, value, files } = event.target
    setForm((current) => ({ ...current, [name]: files ? files[0] ?? null : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError('')
  }

  function validate() {
    const nextErrors = {}
    if (!form.type) nextErrors.type = 'Selecione uma atividade.'
    if (!form.date) nextErrors.date = 'Informe a data.'
    if (form.type === 'walking' && (!form.duration || Number(form.duration) <= 0)) nextErrors.duration = 'Informe a duração da caminhada.'
    if (form.type === 'other' && !form.customType.trim()) nextErrors.customType = 'Informe o nome da atividade.'
    if (!form.proof) nextErrors.proof = 'Adicione uma foto de comprovação.'
    if (form.proof && !form.proof.type.startsWith('image/')) nextErrors.proof = 'Selecione um arquivo de imagem válido.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting || !validate()) return
    const activity = {
      type: form.type,
      customType: form.customType.trim() || null,
      date: form.date,
      duration: form.duration ? Number(form.duration) : null,
      note: form.note.trim() || null,
      countsTowardGoal: counts,
    }

    setIsSubmitting(true)
    setSubmitError('')
    try {
      await onAddActivity(activity, form.proof)
      navigate('/')
    } catch (error) {
      setSubmitError(error.message || 'Não foi possível registrar a atividade. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8"><p className="text-sm font-medium text-lime-brand">Novo registro</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Registrar atividade</h1><p className="mt-3 text-sm text-stone-500">Adicione os dados do seu treino e uma foto de comprovação.</p></div>
      <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-white/8 bg-panel p-5 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tipo de atividade" error={errors.type}>
            <select name="type" value={form.type} onChange={updateField} className={fieldClass}><option value="">Selecione uma opção</option>{ACTIVITY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select>
          </Field>
          <Field label="Data" error={errors.date}><input name="date" type="date" value={form.date} max={toDateKey(new Date())} onChange={updateField} className={fieldClass} /></Field>
          {form.type === 'walking' && <Field label="Duração (minutos)" error={errors.duration} hint="Caminhadas contam a partir de 30 minutos."><input name="duration" type="number" min="1" inputMode="numeric" value={form.duration} onChange={updateField} placeholder="Ex.: 45" className={fieldClass} /></Field>}
          {form.type === 'other' && <Field label="Nome da atividade" error={errors.customType}><input name="customType" value={form.customType} onChange={updateField} placeholder="Ex.: Yoga" className={fieldClass} /></Field>}
          {selectedType && <div className="sm:col-span-2"><div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${counts ? 'border-lime-brand/15 bg-lime-brand/6 text-lime-brand' : 'border-amber-300/15 bg-amber-300/5 text-amber-100'}`}><Icon name={counts ? 'check' : 'activity'} className="mt-0.5 h-4 w-4 shrink-0" /><div><strong className="font-semibold">{counts ? 'Esta atividade conta para sua meta.' : 'Esta atividade não conta para sua meta.'}</strong><p className="mt-1 text-xs opacity-70">{getRuleMessage(form.type, form.duration)}</p></div></div></div>}
          <div className="sm:col-span-2"><Field label="Foto de comprovação" error={errors.proof} hint="A imagem será armazenada com acesso privado."><label className="mt-2 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.025] p-4 transition hover:border-lime-brand/40"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-stone-400"><Icon name="image" /></span><span className="min-w-0"><span className="block truncate text-sm font-medium text-white">{form.proof?.name ?? 'Escolher uma foto'}</span><span className="mt-1 block text-xs text-stone-500">Toque para selecionar do dispositivo</span></span><input name="proof" type="file" accept="image/*" onChange={updateField} className="sr-only" /></label></Field></div>
          <div className="sm:col-span-2"><Field label="Observação (opcional)"><textarea name="note" value={form.note} onChange={updateField} rows="4" placeholder="Como foi o treino?" className={`${fieldClass} resize-none`} /></Field></div>
        </div>
        {submitError && <div className="mt-6 rounded-xl border border-red-300/15 bg-red-300/5 p-4 text-sm text-red-100" role="alert">{submitError}</div>}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/8 pt-6 sm:flex-row sm:justify-end"><button type="button" disabled={isSubmitting} onClick={() => navigate('/')} className="rounded-xl px-5 py-3 text-sm font-semibold text-stone-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">Cancelar</button><button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-xl bg-lime-brand px-6 py-3 text-sm font-bold text-[#0b100c] transition hover:bg-[#d8ff70] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Enviando...' : 'Salvar atividade'} {!isSubmitting && <Icon name="arrow" className="h-4 w-4" />}</button></div>
      </form>
    </div>
  )
}

function Field({ label, error, hint, children }) {
  return <label className="block text-sm font-medium text-stone-300">{label}{children}{error && <span className="mt-2 block text-xs text-red-300">{error}</span>}{!error && hint && <span className="mt-2 block text-xs font-normal text-stone-600">{hint}</span>}</label>
}

function getRuleMessage(type, duration) {
  if (type === 'walking') return Number(duration) >= 30 ? 'A duração mínima de 30 minutos foi atingida.' : 'Informe 30 minutos ou mais para ela ser válida.'
  if (type === 'football' || type === 'footvolley') return 'Futebol e futevôlei ficam no histórico, mas não avançam o desafio.'
  return 'Ao salvar, ela será adicionada ao progresso da semana correspondente.'
}

export default NewActivity
