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
  } catch (error: any) {
    console.error('❌ [Chart API] Erro ao buscar dados do gráfico:', error)
    console.error('❌ [Chart API] Código do erro:', error.code)
    console.error('❌ [Chart API] Mensagem:', error.message)
    
    // Erros de conexão com o banco
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server') || error.message?.includes('connect ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Erro ao conectar ao banco de dados',
          details: process.env.NODE_ENV === 'development' ? {
            code: error.code,
            message: error.message,
            hint: 'Verifique se o PostgreSQL está rodando e se o DATABASE_URL está correto no arquivo .env'
          } : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados do gráfico',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code
        } : undefined
      },
      { status: 500 }
    )
  }
}



