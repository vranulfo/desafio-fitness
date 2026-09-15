import { NavLink } from 'react-router-dom'
import { Icon } from './Icons'

const navItems = [
  { to: '/', label: 'Início', icon: 'home' },
  { to: '/nova-atividade', label: 'Nova atividade', icon: 'plus' },
  { to: '/historico', label: 'Histórico', icon: 'history' },
]

function Navbar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-lime-brand text-[#0b100c]' : 'text-stone-400 hover:bg-white/5 hover:text-white'
    }`

  return (
    <>
      <header className="sticky top-0 z-20 hidden border-b border-white/8 bg-[#080d0b]/85 backdrop-blur-xl sm:block">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-brand text-[#0b100c]">
              <Icon name="activity" />
            </span>
            <span className="font-semibold tracking-tight">Desafio Fitness</span>
          </NavLink>
          <nav className="flex gap-1">{navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClasses}><Icon name={item.icon} className="h-4 w-4" />{item.label}</NavLink>)}</nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-white/10 bg-[#0d130f]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium ${isActive ? 'text-lime-brand' : 'text-stone-500'}`}>
            <Icon name={item.icon} className="h-5 w-5" />{item.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Navbar
