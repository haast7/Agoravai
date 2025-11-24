import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import type { PostbackType } from '@/lib/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, url, type } = await request.json()

    const postback = await prisma.postback.findUnique({
      where: { id: params.id },
    })

    if (!postback || postback.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Postback não encontrado' },
        { status: 404 }
      )
    }

    if (type) {
      const validTypes: PostbackType[] = ['ViewPage', 'ClickButton', 'EnterChannel', 'ExitChannel']
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: 'Tipo de postback inválido' },
          { status: 400 }
        )
      }
    }

    if (url) {
      try {
        new URL(url)
      } catch {
        return NextResponse.json(
          { error: 'URL inválida' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.postback.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(type && { type }),
      },
      include: {
        pixel: {
          select: {
            id: true,
            name: true,
          },
        },
        funnel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar postback:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar postback' },
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
    const postback = await prisma.postback.findUnique({
      where: { id: params.id },
    })

    if (!postback || postback.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Postback não encontrado' },
        { status: 404 }
      )
    }

    await prisma.postback.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar postback:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar postback' },
      { status: 500 }
    )
  }
}



