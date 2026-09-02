import { useEffect, type ReactNode } from 'react'
import styles from './BottomSheet.module.css'

type BottomSheetProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className={styles.handle} />
        <h2 id="sheet-title" className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
