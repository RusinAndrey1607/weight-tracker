import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDisplayDate, getToday } from '../../../utils/date.ts'
import { formatWeight } from '../../../utils/format.ts'
import type { ChartPeriod, WeightEntry } from '../types.ts'
import { filterEntriesByPeriod } from '../utils/calculations.ts'
import styles from './WeightChart.module.css'

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: 7, label: '7D' },
  { value: 30, label: '30D' },
  { value: 90, label: '90D' },
  { value: 'all', label: 'All' },
]

type WeightChartProps = {
  entries: WeightEntry[]
}

type ChartPoint = {
  date: string
  weight: number
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartPoint }>
}) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>{formatDisplayDate(point.date)}</div>
      <div className={styles.tooltipWeight}>{formatWeight(point.weight)} kg</div>
    </div>
  )
}

export function WeightChart({ entries }: WeightChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>(30)
  const today = getToday()

  const data = useMemo(
    () =>
      filterEntriesByPeriod(entries, period, today).map((entry) => ({
        date: entry.date,
        weight: entry.weight,
      })),
    [entries, period, today],
  )

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Trend</h2>
        <div className={styles.periods} role="tablist" aria-label="Chart period">
          {PERIODS.map((item) => (
            <button
              key={String(item.value)}
              type="button"
              role="tab"
              aria-selected={period === item.value}
              className={[styles.period, period === item.value ? styles.active : ''].join(' ')}
              onClick={() => setPeriod(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <p className={styles.empty}>Not enough data</p>
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDisplayDate}
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 0.4', 'dataMax + 0.4']}
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)' }} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--accent)"
                strokeWidth={1.8}
                dot={{ r: data.length < 8 ? 3 : 0, strokeWidth: 0, fill: 'var(--accent)' }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
