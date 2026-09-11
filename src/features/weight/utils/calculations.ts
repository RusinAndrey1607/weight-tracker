import {
  compareISODate,
  getDateDaysAgo,
  getEndOfWeek,
  getStartOfWeek,
  getToday,
  getWeekKey,
} from '../../../utils/date.ts'
import { roundToTenth } from '../../../utils/format.ts'
import type { ChartPeriod, WeightEntry } from '../types.ts'

function byDateAsc(a: WeightEntry, b: WeightEntry): number {
  return compareISODate(a.date, b.date)
}

export function sortEntriesByDate(
  entries: WeightEntry[],
  direction: 'asc' | 'desc' = 'desc',
): WeightEntry[] {
  const sorted = [...entries].sort(byDateAsc)
  return direction === 'desc' ? sorted.reverse() : sorted
}

export function getLatestEntry(entries: WeightEntry[]): WeightEntry | null {
  return sortEntriesByDate(entries, 'desc')[0] ?? null
}

export function getCurrentWeight(entries: WeightEntry[]): number | null {
  return getLatestEntry(entries)?.weight ?? null
}

export function findEntryByDate(
  entries: WeightEntry[],
  date: string,
): WeightEntry | undefined {
  return entries.find((entry) => entry.date === date)
}

export function calculatePeriodAverage(
  entries: WeightEntry[],
  fromISO: string,
  toISO: string,
): number | null {
  const inPeriod = entries.filter(
    (entry) => entry.date >= fromISO && entry.date <= toISO,
  )

  if (inPeriod.length === 0) return null

  const sum = inPeriod.reduce((total, entry) => total + entry.weight, 0)
  return roundToTenth(sum / inPeriod.length)
}

export function calculateWeeklyAverage(
  entries: WeightEntry[],
  todayISO = getToday(),
): number | null {
  const weekStart = getStartOfWeek(todayISO)
  return calculatePeriodAverage(entries, weekStart, todayISO)
}

export function calculatePreviousWeekAverage(
  entries: WeightEntry[],
  todayISO = getToday(),
): number | null {
  const previousWeekEnd = getDateDaysAgo(1, getStartOfWeek(todayISO))
  const previousWeekStart = getStartOfWeek(previousWeekEnd)
  return calculatePeriodAverage(entries, previousWeekStart, getEndOfWeek(previousWeekStart))
}

export function filterEntriesByPeriod(
  entries: WeightEntry[],
  period: ChartPeriod,
  todayISO = getToday(),
): WeightEntry[] {
  if (period === 'all') return sortEntriesByDate(entries, 'asc')
  const from = getDateDaysAgo(period - 1, todayISO)
  return sortEntriesByDate(
    entries.filter((entry) => entry.date >= from),
    'asc',
  )
}

export type WeekGroup = {
  weekStart: string
  average: number
  entries: WeightEntry[]
}

export function groupEntriesByWeek(entries: WeightEntry[]): WeekGroup[] {
  const groups = new Map<string, WeightEntry[]>()

  for (const entry of entries) {
    const weekStart = getWeekKey(entry.date)
    const group = groups.get(weekStart) ?? []
    group.push(entry)
    groups.set(weekStart, group)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareISODate(b, a))
    .map(([weekStart, weekEntries]) => ({
      weekStart,
      entries: sortEntriesByDate(weekEntries, 'desc'),
      average: calculatePeriodAverage(weekEntries, weekStart, getEndOfWeek(weekStart)) ?? 0,
    }))
}

export function calculateWeeklyChange(
  entries: WeightEntry[],
  todayISO = getToday(),
): number | null {
  const currentWeekAverage = calculateWeeklyAverage(entries, todayISO)
  const previousWeekAverage = calculatePreviousWeekAverage(entries, todayISO)

  if (
    currentWeekAverage === null ||
    previousWeekAverage === null
  ) {
    return null
  }

  return roundToTenth(currentWeekAverage - previousWeekAverage)
}