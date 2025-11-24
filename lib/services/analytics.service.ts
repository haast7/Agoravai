import { prisma } from '../prisma'
import { formatDate } from '../utils'
import type { DashboardMetrics, DailyRetention, ChartDataPoint } from '../types'

export class AnalyticsService {
  async getDashboardMetrics(
    userId: string,
    funnelId?: string,
    pixelId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DashboardMetrics> {
    const now = endDate || new Date()
    const start = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const previousStart = new Date(start.getTime() - (now.getTime() - start.getTime()))

    // Construir filtro através dos funis do usuário
    const funnelFilter: any = {
      userId,
    }
    
    if (funnelId) {
      funnelFilter.id = funnelId
    } else if (pixelId) {
      funnelFilter.pixelId = pixelId
    }

    const where: any = {
      funnel: funnelFilter,
      createdAt: {
        gte: start,
        lte: now,
      },
    }

    const previousWhere = {
      funnel: funnelFilter,
      createdAt: {
        gte: previousStart,
        lte: start,
      },
    }

    // Buscar eventos do período atual
    const [pageviews, clicks, entries, exits] = await Promise.all([
      prisma.event.count({ where: { ...where, type: 'PageView' } }),
      prisma.event.count({ where: { ...where, type: 'Click' } }),
      prisma.event.count({ where: { ...where, type: 'EnterChannel' } }),
      prisma.event.count({ where: { ...where, type: 'ExitChannel' } }),
    ])

    // Buscar eventos do período anterior
    const [prevPageviews, prevClicks, prevEntries, prevExits] = await Promise.all([
      prisma.event.count({ where: { ...previousWhere, type: 'PageView' } }),
      prisma.event.count({ where: { ...previousWhere, type: 'Click' } }),
      prisma.event.count({ where: { ...previousWhere, type: 'EnterChannel' } }),
      prisma.event.count({ where: { ...previousWhere, type: 'ExitChannel' } }),
    ])

    // Calcular mudanças percentuais
    const pageviewsChange = prevPageviews > 0 
      ? ((pageviews - prevPageviews) / prevPageviews) * 100 
      : 0
    const clicksChange = prevClicks > 0 
      ? ((clicks - prevClicks) / prevClicks) * 100 
      : 0
    const entriesChange = prevEntries > 0 
      ? ((entries - prevEntries) / prevEntries) * 100 
      : 0
    const exitsChange = prevExits > 0 
      ? ((exits - prevExits) / prevExits) * 100 
      : 0

    // Calcular taxas
    const conversionRate = pageviews > 0 ? (entries / pageviews) * 100 : 0
    const clickRate = pageviews > 0 ? (clicks / pageviews) * 100 : 0
    const entryRate = clicks > 0 ? (entries / clicks) * 100 : 0
    const retentionRate = entries > 0 
      ? ((entries - exits) / entries) * 100 
      : (entries === 0 && exits === 0 ? 100 : 0)

    return {
      pageviews,
      clicks,
      entries,
      exits,
      pageviewsChange,
      clicksChange,
      entriesChange,
      exitsChange,
      conversionRate,
      clickRate,
      entryRate,
      retentionRate,
    }
  }

  async getChartData(
    userId: string,
    type: 'PageView' | 'Click' | 'EnterChannel' | 'ExitChannel',
    funnelId?: string,
    pixelId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ChartDataPoint[]> {
    const now = endDate || new Date()
    const start = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const where: any = {
      userId,
      type,
      createdAt: {
        gte: start,
        lte: now,
      },
    }

    if (funnelId) {
      where.funnelId = funnelId
    } else if (pixelId) {
      where.funnel = { pixelId }
    }

    const events = await prisma.event.findMany({
      where,
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Agrupar por dia
    const dailyCounts = new Map<string, number>()
    
    events.forEach((event) => {
      const day = formatDate(event.createdAt)
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1)
    })

    // Preencher todos os dias do período
    const result: ChartDataPoint[] = []
    const currentDate = new Date(start)
    
    while (currentDate <= now) {
      const day = formatDate(currentDate)
      result.push({
        date: day,
        value: dailyCounts.get(day) || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  async getDailyRetention(
    userId: string,
    funnelId?: string,
    pixelId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DailyRetention[]> {
    const now = endDate || new Date()
    const start = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Construir filtro através dos funis do usuário
    const funnelFilter: any = {
      userId,
    }
    
    if (funnelId) {
      funnelFilter.id = funnelId
    } else if (pixelId) {
      funnelFilter.pixelId = pixelId
    }

    const [entryEvents, exitEvents] = await Promise.all([
      prisma.event.findMany({
        where: {
          funnel: funnelFilter,
          type: 'EnterChannel',
          createdAt: {
            gte: start,
            lte: now,
          },
        },
        select: { createdAt: true },
      }),
      prisma.event.findMany({
        where: {
          funnel: funnelFilter,
          type: 'ExitChannel',
          createdAt: {
            gte: start,
            lte: now,
          },
        },
        select: { createdAt: true },
      }),
    ])

    // Agrupar por dia
    const dailyEntries = new Map<string, number>()
    const dailyExits = new Map<string, number>()

    entryEvents.forEach((event) => {
      const day = formatDate(event.createdAt)
      dailyEntries.set(day, (dailyEntries.get(day) || 0) + 1)
    })

    exitEvents.forEach((event) => {
      const day = formatDate(event.createdAt)
      dailyExits.set(day, (dailyExits.get(day) || 0) + 1)
    })

    // Criar array de retenção diária
    const result: DailyRetention[] = []
    const currentDate = new Date(start)
    
    while (currentDate <= now) {
      const day = formatDate(currentDate)
      const entries = dailyEntries.get(day) || 0
      const exits = dailyExits.get(day) || 0
      const retention = entries > 0 
        ? ((entries - exits) / entries) * 100 
        : (entries === 0 && exits === 0 ? 0 : 0)

      result.push({
        day,
        entries,
        exits,
        retention: Math.round(retention * 100) / 100,
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result.reverse() // Mais recente primeiro
  }
}

export const analyticsService = new AnalyticsService()



