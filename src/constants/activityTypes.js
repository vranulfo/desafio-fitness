export const ACTIVITY_TYPES = [
  { value: 'gym', label: 'Academia', countsTowardGoal: true },
  { value: 'strength', label: 'Musculação', countsTowardGoal: true },
  { value: 'running', label: 'Corrida', countsTowardGoal: true },
  { value: 'walking', label: 'Caminhada', countsTowardGoal: true, minimumDuration: 30 },
  { value: 'cycling', label: 'Bike', countsTowardGoal: true },
  { value: 'swimming', label: 'Natação', countsTowardGoal: true },
  { value: 'functional', label: 'Treino funcional', countsTowardGoal: true },
  { value: 'home-workout', label: 'Treino em casa', countsTowardGoal: true },
  { value: 'football', label: 'Futebol', countsTowardGoal: false },
  { value: 'footvolley', label: 'Futevôlei', countsTowardGoal: false },
  { value: 'other', label: 'Outro', countsTowardGoal: true },
]

export const getActivityType = (value) =>
  ACTIVITY_TYPES.find((activityType) => activityType.value === value)

export const getActivityLabel = (activity) => {
  if (activity.type === 'other' && activity.customType) return activity.customType
  return getActivityType(activity.type)?.label ?? 'Atividade'
}
