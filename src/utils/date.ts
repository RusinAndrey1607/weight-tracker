const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isValidISODate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false

  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function parseISODateLocal(iso: string): Date {
  if (!isValidISODate(iso)) {
    throw new Error(`Invalid ISO date: ${iso}`)
  }

  const year = Number(iso.slice(0, 4))
  const month = Number(iso.slice(5, 7))
  const day = Number(iso.slice(8, 10))
  return new Date(year, month - 1, day)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getToday(): string {
  return formatDate(new Date())
}

export function formatDisplayDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(parseISODateLocal(iso))
}

export function getStartOfWeek(iso: string): string {
  const date = parseISODateLocal(iso)
  const weekday = date.getDay()
  const diff = weekday === 0 ? -6 : 1 - weekday
  date.setDate(date.getDate() + diff)
  return formatDate(date)
}

export function getEndOfWeek(iso: string): string {
  const start = parseISODateLocal(getStartOfWeek(iso))
  start.setDate(start.getDate() + 6)
  return formatDate(start)
}

export function isSameDay(a: string, b: string): boolean {
  return a === b
}

export function getDateDaysAgo(days: number, fromISO = getToday()): string {
  const date = parseISODateLocal(fromISO)
  date.setDate(date.getDate() - days)
  return formatDate(date)
}

export function getWeekKey(iso: string): string {
  return getStartOfWeek(iso)
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = parseISODateLocal(fromISO)
  const to = parseISODateLocal(toISO)
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

export function compareISODate(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}
