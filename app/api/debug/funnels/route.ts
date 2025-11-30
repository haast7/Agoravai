import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

/**
 * ROTA DE DEBUG - Mostra todos os funis e seus Script IDs
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
    const funnels = await prisma.funnel.findMany({
      where: { userId: user!.id },
      select: {
        id: true,
        name: true,
        trackingScriptId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      message: 'Funis do usuário',
      funnels: funnels.map(f => ({
        id: f.id,
        name: f.name,
        trackingScriptId: f.trackingScriptId,
        scriptUrl: `http://localhost:3000/api/tracking/${f.trackingScriptId}.js`,
        createdAt: f.createdAt,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao buscar funis', details: error.message },
      { status: 500 }
    )
  }
}







