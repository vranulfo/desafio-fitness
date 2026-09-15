import { getActivityType } from '../constants/activityTypes'
import { CHALLENGE_START_DATE, WEEKLY_GOAL } from '../data/initialData'
import { getWeeksBetween, isDateInWeek, toDateKey } from './week'

export function doesActivityCount(activity) {
  const type = getActivityType(activity.type)
  if (!type?.countsTowardGoal) return false
  if (type.minimumDuration) return Number(activity.duration) >= type.minimumDuration
  return true
}

export const countValidActivities = (activities) => activities.filter(doesActivityCount).length
export const isWeeklyGoalMet = (activities) => countValidActivities(activities) >= WEEKLY_GOAL
export const getActivitiesForWeek = (activities, weekReference) =>
  activities.filter((activity) => isDateInWeek(activity.date, weekReference))

export function groupActivitiesByWeek(activities, startDate = CHALLENGE_START_DATE, endDate = new Date()) {
  return getWeeksBetween(startDate, endDate)
    .map((weekStart) => ({
      weekKey: toDateKey(weekStart),
      weekStart,
      activities: getActivitiesForWeek(activities, weekStart).sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .reverse()
}
