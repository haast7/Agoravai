import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const funnel = await prisma.funnel.findUnique({
      where: { id: params.id },
      include: {
        domain: true,
      },
    })

    if (!funnel || funnel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Funil não encontrado' },
        { status: 404 }
      )
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const scriptUrl = `${appUrl}/api/tracking/${funnel.trackingScriptId}.js`
    const telegramLink = funnel.telegramInviteLink || ''

    return NextResponse.json({
      script: `<script src="${scriptUrl}"></script>`,
      scriptUrl,
      telegramLink,
    })
  } catch (error) {
    console.error('Erro ao buscar instruções:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar instruções' },
      { status: 500 }
    )
  }
}



