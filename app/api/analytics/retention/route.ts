import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/middleware'
import { analyticsService } from '@/lib/services/analytics.service'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const searchParams = request.nextUrl.searchParams
    const funnelId = searchParams.get('funnelId') || undefined
    const pixelId = searchParams.get('pixelId') || undefined
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined

    const retention = await analyticsService.getDailyRetention(
      user!.id,
      funnelId,
      pixelId,
      startDate,
      endDate
    )

    return NextResponse.json(retention)
  } catch (error) {
    console.error('Erro ao buscar retenção:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar retenção' },
      { status: 500 }
    )
  }
}





