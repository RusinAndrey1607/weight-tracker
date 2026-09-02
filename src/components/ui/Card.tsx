import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <section className={[styles.card, className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}
