import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { channelId, channelType } = await request.json()

    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
    })

    if (!channel || channel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      )
    }

    const updated = await prisma.channel.update({
      where: { id: params.id },
      data: {
        ...(channelId && { channelId }),
        ...(channelType && { channelType }),
      },
      select: {
        id: true,
        name: true,
        botName: true,
        botToken: true,
        channelId: true,
        channelType: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar canal:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar canal' },
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
    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
    })

    if (!channel || channel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      )
    }

    await prisma.channel.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar canal:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar canal' },
      { status: 500 }
    )
  }
}
