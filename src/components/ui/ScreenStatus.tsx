import styles from './ScreenStatus.module.css'

type ScreenStatusProps = {
  message: string
  tone?: 'neutral' | 'error'
}

export function ScreenStatus({ message, tone = 'neutral' }: ScreenStatusProps) {
  return (
    <p className={[styles.status, tone === 'error' ? styles.error : ''].join(' ')}>
      {message}
    </p>
  )
}
