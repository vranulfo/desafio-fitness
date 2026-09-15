const DAY_IN_MS = 24 * 60 * 60 * 1000

export function parseLocalDate(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateKey(value) {
  const date = parseLocalDate(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getWeekStart(value = new Date()) {
  const date = parseLocalDate(value)
  const mondayOffset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - mondayOffset)
  return date
}

export function getWeekEnd(value = new Date()) {
  const date = getWeekStart(value)
  date.setDate(date.getDate() + 6)
  return date
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR').format(parseLocalDate(value))
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(parseLocalDate(value))
    .replace('.', '')
}

export function formatWeekPeriod(value) {
  return `${formatShortDate(getWeekStart(value))} — ${formatShortDate(getWeekEnd(value))}`
}

export function isDateInWeek(date, weekReference) {
  const timestamp = parseLocalDate(date).getTime()
  return timestamp >= getWeekStart(weekReference).getTime() && timestamp <= getWeekEnd(weekReference).getTime()
}

export function isWeekComplete(weekReference, today = new Date()) {
  return getWeekEnd(weekReference).getTime() < parseLocalDate(today).getTime()
}

export function getWeeksBetween(startValue, endValue = new Date()) {
  const weeks = []
  const first = getWeekStart(startValue)
  const last = getWeekStart(endValue)
  for (let cursor = first; cursor <= last; cursor = new Date(cursor.getTime() + 7 * DAY_IN_MS)) {
    weeks.push(new Date(cursor))
  }
  return weeks
}
