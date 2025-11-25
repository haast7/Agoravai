import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import type { PostbackType } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const postbacks = await prisma.postback.findMany({
      where: { userId: user!.id },
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
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(postbacks)
  } catch (error) {
    console.error('Erro ao buscar postbacks:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar postbacks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, url, type, pixelId, funnelId } = await request.json()

    if (!name || !url || !type) {
      return NextResponse.json(
        { error: 'Nome, URL e Tipo são obrigatórios' },
        { status: 400 }
      )
    }

    const validTypes: PostbackType[] = ['ViewPage', 'ClickButton', 'EnterChannel', 'ExitChannel']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de postback inválido' },
        { status: 400 }
      )
    }

    // Validar URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      )
    }

    // Validar que os recursos pertencem ao usuário (se fornecidos)
    if (pixelId) {
      const pixel = await prisma.pixel.findUnique({
        where: { id: pixelId },
      })
      if (!pixel || pixel.userId !== user!.id) {
        return NextResponse.json(
          { error: 'Pixel não encontrado' },
          { status: 404 }
        )
      }
    }

    if (funnelId) {
      const funnel = await prisma.funnel.findUnique({
        where: { id: funnelId },
      })
      if (!funnel || funnel.userId !== user!.id) {
        return NextResponse.json(
          { error: 'Funil não encontrado' },
          { status: 404 }
        )
      }
    }

    const postback = await prisma.postback.create({
      data: {
        name,
        url,
        type,
        pixelId: pixelId || null,
        funnelId: funnelId || null,
        userId: user!.id,
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

    return NextResponse.json(postback)
  } catch (error) {
    console.error('Erro ao criar postback:', error)
    return NextResponse.json(
      { error: 'Erro ao criar postback' },
      { status: 500 }
    )
  }
}





