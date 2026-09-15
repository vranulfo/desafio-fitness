import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import NewActivity from './pages/NewActivity'
import { INITIAL_ACTIVITIES } from './data/initialData'

function App() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)

  function addActivity(activity) {
    setActivities((current) => [activity, ...current])
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080d0b] text-stone-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard activities={activities} />} />
            <Route path="/nova-atividade" element={<NewActivity onAddActivity={addActivity} />} />
            <Route path="/historico" element={<History activities={activities} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
