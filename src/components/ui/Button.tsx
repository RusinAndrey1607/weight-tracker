import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
