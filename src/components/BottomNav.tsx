import { History, Home, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : ''].join(' ')
          }
        >
          <item.icon className={styles.icon} strokeWidth={1.8} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
