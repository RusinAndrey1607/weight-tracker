import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { EmptyState } from '../../components/ui/EmptyState.tsx'
import { ScreenStatus } from '../../components/ui/ScreenStatus.tsx'
import { AddWeightSheet } from '../../features/weight/components/AddWeightSheet.tsx'
import { CurrentWeight } from '../../features/weight/components/CurrentWeight.tsx'
import { StatsCard } from '../../features/weight/components/StatsCard.tsx'
import { WeightChart } from '../../features/weight/components/WeightChart.tsx'
import { useWeightEntries } from '../../features/weight/hooks/useWeightEntries.ts'
import {
  calculatePreviousWeekAverage,
  calculateSevenDayChange,
  calculateWeeklyAverage,
  getCurrentWeight,
  getLatestEntry,
} from '../../features/weight/utils/calculations.ts'
import { getToday } from '../../utils/date.ts'
import styles from './HomePage.module.css'

export function HomePage() {
  const { entries, loading, error, addEntry, updateEntry } = useWeightEntries()
  const [sheetOpen, setSheetOpen] = useState(false)
  const today = getToday()

  const stats = useMemo(() => {
    const latest = getLatestEntry(entries)
    return {
      current: getCurrentWeight(entries),
      latestDate: latest?.date ?? null,
      change7d: calculateSevenDayChange(entries),
      weeklyAverage: calculateWeeklyAverage(entries, today),
      previousWeek: calculatePreviousWeekAverage(entries, today),
    }
  }, [entries, today])

  if (loading) {
    return <ScreenStatus message="Loading…" />
  }

  if (error) {
    return <ScreenStatus tone="error" message={error} />
  }

  const sheet = sheetOpen ? (
    <AddWeightSheet
      entries={entries}
      onClose={() => setSheetOpen(false)}
      onAdd={addEntry}
      onUpdate={updateEntry}
    />
  ) : null

  if (entries.length === 0) {
    return (
      <>
        <EmptyState
          title="Start tracking your weight"
          text="Add your first measurement to see your progress."
          action={
            <Button fullWidth onClick={() => setSheetOpen(true)}>
              Add weight
            </Button>
          }
        />
        {sheet}
      </>
    )
  }

  return (
    <div className={styles.page}>
      <Card>
        <CurrentWeight
          weight={stats.current}
          updatedDate={stats.latestDate}
          today={today}
        />
      </Card>

      <Card>
        <StatsCard
          current={stats.current}
          change7d={stats.change7d}
          weeklyAverage={stats.weeklyAverage}
          previousWeek={stats.previousWeek}
        />
      </Card>

      <Card>
        <WeightChart entries={entries} />
      </Card>

      <Button fullWidth onClick={() => setSheetOpen(true)}>
        Add weight
      </Button>

      {sheet}
    </div>
  )
}
