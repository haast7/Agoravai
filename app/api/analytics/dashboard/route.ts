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

    const metrics = await analyticsService.getDashboardMetrics(
      user!.id,
      funnelId,
      pixelId,
      startDate,
      endDate
    )

    return NextResponse.json(metrics)
  } catch (error: any) {
    console.error('❌ [Dashboard API] Erro ao buscar métricas:', error)
    console.error('❌ [Dashboard API] Código do erro:', error.code)
    console.error('❌ [Dashboard API] Mensagem:', error.message)
    console.error('❌ [Dashboard API] Stack:', error.stack)
    
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
    
    // Erro de autenticação do banco
    if (error.code === 'P1000' || error.message?.includes('authentication failed')) {
      return NextResponse.json(
        { 
          error: 'Erro de autenticação no banco de dados',
          details: process.env.NODE_ENV === 'development' ? {
            code: error.code,
            message: error.message,
            hint: 'Verifique se a senha do PostgreSQL no DATABASE_URL está correta'
          } : undefined
        },
        { status: 500 }
      )
    }
    
    // Erro de banco não encontrado
    if (error.code === 'P1003' || error.message?.includes('database') && error.message?.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Banco de dados não encontrado',
          details: process.env.NODE_ENV === 'development' ? {
            code: error.code,
            message: error.message,
            hint: 'Execute: CREATE DATABASE track4you; no PostgreSQL'
          } : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar métricas',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    )
  }
}






