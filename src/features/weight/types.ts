export type WeightEntry = {
  id: string
  weight: number
  date: string
  createdAt: string
  updatedAt: string
}

export type NewWeightEntry = {
  weight: number
  date: string
}

export type ChartPeriod = 7 | 30 | 90 | 'all'

export type WeightStore = {
  version: number
  entries: WeightEntry[]
}

export type WeightExport = WeightStore & {
  exportedAt: string
}

export const DATA_VERSION = 1
export const STORAGE_KEY = 'weight-tracker-data'
export const MAX_WEIGHT = 500
