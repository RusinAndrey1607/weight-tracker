import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  title: string
  text: string
  action?: ReactNode
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  )
}
