import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

/**
 * ROTA DE DEBUG - Mostra todos os eventos salvos
 * 
 * ⚠️ APENAS PARA DESENVOLVIMENTO
 * Delete esta rota em produção!
 */
export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Esta rota só está disponível em desenvolvimento' },
      { status: 403 }
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const funnelId = searchParams.get('funnelId') || undefined

    // Buscar funis do usuário
    const userFunnels = await prisma.funnel.findMany({
      where: { userId: user!.id },
      select: { id: true, name: true, trackingScriptId: true },
    })

    const funnelFilter: any = {
      userId: user!.id,
    }
    if (funnelId) {
      funnelFilter.id = funnelId
    }

    // Buscar eventos
    const events = await prisma.event.findMany({
      where: {
        funnel: funnelFilter,
      },
      include: {
        funnel: {
          select: {
            id: true,
            name: true,
            trackingScriptId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    // Contar eventos por tipo
    const counts = await Promise.all([
      prisma.event.count({
        where: {
          funnel: funnelFilter,
          type: 'PageView',
        },
      }),
      prisma.event.count({
        where: {
          funnel: funnelFilter,
          type: 'Click',
        },
      }),
      prisma.event.count({
        where: {
          funnel: funnelFilter,
          type: 'EnterChannel',
        },
      }),
      prisma.event.count({
        where: {
          funnel: funnelFilter,
          type: 'ExitChannel',
        },
      }),
    ])

    return NextResponse.json({
      message: 'Eventos do usuário',
      userFunnels,
      totalEvents: {
        PageView: counts[0],
        Click: counts[1],
        EnterChannel: counts[2],
        ExitChannel: counts[3],
      },
      recentEvents: events.map(e => ({
        id: e.id,
        type: e.type,
        funnelId: e.funnelId,
        funnelName: e.funnel.name,
        funnelScriptId: e.funnel.trackingScriptId,
        url: e.url,
        createdAt: e.createdAt,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao buscar eventos', details: error.message },
      { status: 500 }
    )
  }
}



