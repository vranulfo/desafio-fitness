import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import NewActivity from './pages/NewActivity'
import { createActivity, fetchActivities } from './services/activities'

function App() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadActivities = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')
    try {
      setActivities(await fetchActivities())
    } catch (error) {
      setLoadError(error.message || 'Não foi possível carregar as atividades.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    fetchActivities()
      .then((loadedActivities) => {
        if (isActive) setActivities(loadedActivities)
      })
      .catch((error) => {
        if (isActive) setLoadError(error.message || 'Não foi possível carregar as atividades.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function addActivity(activity, proofFile) {
    const savedActivity = await createActivity(activity, proofFile)
    setActivities((current) => [savedActivity, ...current])
    return savedActivity
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080d0b] text-stone-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
          {loadError && <ErrorBanner message={loadError} onRetry={loadActivities} />}
          {isLoading ? <LoadingState /> : (
            <Routes>
              <Route path="/" element={<Dashboard activities={activities} />} />
              <Route path="/nova-atividade" element={<NewActivity onAddActivity={addActivity} />} />
              <Route path="/historico" element={<History activities={activities} />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-300/15 bg-red-300/5 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between">
      <span>{message} Os dados já carregados, se houver, foram mantidos.</span>
      <button type="button" onClick={onRetry} className="shrink-0 rounded-lg bg-white/8 px-3 py-2 font-semibold text-white hover:bg-white/12">Tentar novamente</button>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-lime-brand" /><p className="mt-4 text-sm text-stone-500">Carregando atividades...</p></div>
    </div>
  )
}

export default App
