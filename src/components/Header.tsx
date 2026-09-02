import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <h1 className={styles.brand}>Weight</h1>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => navigate('/settings')}
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}
