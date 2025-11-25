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
        pixel: {
          select: {
            id: true,
            name: true,
            pixelId: true,
          },
        },
        domain: {
          select: {
            id: true,
            url: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            botName: true,
          },
        },
      },
    })

    if (!funnel || funnel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Funil não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(funnel)
  } catch (error) {
    console.error('Erro ao buscar funil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar funil' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const funnel = await prisma.funnel.findUnique({
      where: { id: params.id },
    })

    if (!funnel || funnel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Funil não encontrado' },
        { status: 404 }
      )
    }

    await prisma.funnel.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar funil:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar funil' },
      { status: 500 }
    )
  }
}





