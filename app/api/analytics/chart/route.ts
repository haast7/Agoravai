import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/middleware'
import { analyticsService } from '@/lib/services/analytics.service'
import type { EventType } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const searchParams = request.nextUrl.searchParams
    const type = (searchParams.get('type') || 'PageView') as EventType
    const funnelId = searchParams.get('funnelId') || undefined
    const pixelId = searchParams.get('pixelId') || undefined
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined

    const data = await analyticsService.getChartData(
      user!.id,
      type,
      funnelId,
      pixelId,
      startDate,
      endDate
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do gráfico' },
      { status: 500 }
    )
  }
}



