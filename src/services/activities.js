import { isSupabaseConfigured, supabase } from './supabase'

const TABLE_NAME = 'activities'
const PROOFS_BUCKET = 'activity-proofs'
const SIGNED_URL_TTL_SECONDS = 60 * 60

export class ActivityServiceError extends Error {
  constructor(code, message, cause) {
    super(message)
    this.name = 'ActivityServiceError'
    this.code = code
    this.cause = cause
  }
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new ActivityServiceError(
      'configuration',
      'O Supabase não está configurado. Verifique as variáveis de ambiente.',
    )
  }

  return supabase
}

function mapDatabaseActivity(row, signedPhotoUrl = null) {
  return {
    id: row.id,
    date: row.activity_date,
    type: row.activity_type,
    customType: row.custom_activity_type,
    duration: row.duration_minutes,
    note: row.description,
    photoPath: row.photo_url,
    proofStatus: row.proof_status,
    countsTowardGoal: row.counts_toward_goal,
    createdAt: row.created_at,
    signedPhotoUrl,
  }
}

async function createSignedPhotoUrl(photoPath) {
  if (!photoPath) return null

  const client = requireSupabase()
  const { data, error } = await client.storage
    .from(PROOFS_BUCKET)
    .createSignedUrl(photoPath, SIGNED_URL_TTL_SECONDS)

  if (error) return null
  return data.signedUrl
}

export async function fetchActivities() {
  const client = requireSupabase()
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('id, activity_date, activity_type, custom_activity_type, duration_minutes, description, photo_url, proof_status, counts_toward_goal, created_at')
    .order('activity_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new ActivityServiceError(
      'load',
      'Não foi possível carregar as atividades agora.',
      error,
    )
  }

  return Promise.all(
    (data ?? []).map(async (row) => {
      const signedPhotoUrl = row.proof_status === 'external'
        ? null
        : await createSignedPhotoUrl(row.photo_url)
      return mapDatabaseActivity(row, signedPhotoUrl)
    }),
  )
}

function getSafeFileExtension(file) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]{1,10}$/.test(fromName)) return fromName

  const fromMimeType = file.type.split('/').pop()?.toLowerCase()
  if (fromMimeType && /^[a-z0-9]{1,10}$/.test(fromMimeType)) return fromMimeType

  return 'jpg'
}

async function uploadProof(file, activityDate) {
  const client = requireSupabase()
  const extension = getSafeFileExtension(file)
  const photoPath = `${activityDate}/${crypto.randomUUID()}.${extension}`
  const { error } = await client.storage.from(PROOFS_BUCKET).upload(photoPath, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw new ActivityServiceError(
      'upload',
      'Não foi possível enviar a foto. Tente novamente.',
      error,
    )
  }

  return photoPath
}

export async function createActivity(activity, proofFile) {
  const client = requireSupabase()
  const photoPath = await uploadProof(proofFile, activity.date)
  const databaseActivity = {
    activity_date: activity.date,
    activity_type: activity.type,
    custom_activity_type: activity.customType,
    duration_minutes: activity.duration,
    description: activity.note,
    photo_url: photoPath,
    proof_status: 'uploaded',
    counts_toward_goal: activity.countsTowardGoal,
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .insert(databaseActivity)
    .select()
    .single()

  if (error) {
    throw new ActivityServiceError(
      'save',
      'A foto foi enviada, mas não foi possível salvar a atividade. Tente novamente.',
      error,
    )
  }

  const signedPhotoUrl = await createSignedPhotoUrl(photoPath)
  return mapDatabaseActivity(data, signedPhotoUrl)
}
