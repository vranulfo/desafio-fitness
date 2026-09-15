import { INITIAL_DEBT, WEEKLY_DEBT_AMOUNT } from '../data/initialData'
import { countValidActivities, groupActivitiesByWeek, isWeeklyGoalMet } from './activities'
import { isWeekComplete } from './week'

export function getWeekDebt(activities, weekReference, today = new Date()) {
  if (!isWeekComplete(weekReference, today)) return 0
  return isWeeklyGoalMet(activities) ? 0 : WEEKLY_DEBT_AMOUNT
}

export function calculateDebt(activities, today = new Date()) {
  const calculatedDebt = groupActivitiesByWeek(activities, undefined, today).reduce(
    (total, week) => total + getWeekDebt(week.activities, week.weekStart, today), 0,
  )
  return INITIAL_DEBT + calculatedDebt
}

export function getChallengeStats(activities, today = new Date()) {
  const weeks = groupActivitiesByWeek(activities, undefined, today)
  const completedWeeks = weeks.filter(
    (week) => isWeekComplete(week.weekStart, today) && isWeeklyGoalMet(week.activities),
  )
  let currentStreak = 0
  const finishedWeeks = weeks.filter((week) => isWeekComplete(week.weekStart, today))
  for (const week of finishedWeeks) {
    if (!isWeeklyGoalMet(week.activities)) break
    currentStreak += 1
  }
  return { completedWeeks: completedWeeks.length, currentStreak, totalValidActivities: countValidActivities(activities) }
}
