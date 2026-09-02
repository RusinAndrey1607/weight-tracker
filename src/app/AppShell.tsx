import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav.tsx'
import { Header } from '../components/Header.tsx'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <Header />
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
