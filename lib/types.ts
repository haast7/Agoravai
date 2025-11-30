export type EventType = 'PageView' | 'Click' | 'EnterChannel' | 'ExitChannel'
export type PostbackType = 'ViewPage' | 'ClickButton' | 'EnterChannel' | 'ExitChannel'
export type ChannelType = 'private' | 'public'

export interface DashboardMetrics {
  pageviews: number
  clicks: number
  entries: number
  exits: number
  pageviewsChange: number
  clicksChange: number
  entriesChange: number
  exitsChange: number
  conversionRate: number
  clickRate: number
  entryRate: number
  retentionRate: number
}

export interface DailyRetention {
  day: string
  entries: number
  exits: number
  retention: number
}

export interface ChartDataPoint {
  date: string
  value: number
}









