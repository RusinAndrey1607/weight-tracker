import { daysBetween } from './date.ts'

export function formatWeight(weight: number): string {
  return weight.toFixed(1)
}

export function formatSignedWeight(delta: number): string {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return `${sign}${Math.abs(delta).toFixed(1)} kg`
}

export function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10
}

export function roundWeight(value: number): number {
  return Math.round(value * 100) / 100
}

export function formatUpdatedLabel(entryDate: string, today: string): string {
  const days = daysBetween(entryDate, today)

  if (days === 0) return 'Updated today'
  if (days === 1) return 'Updated 1 day ago'
  return `Updated ${days} days ago`
}
