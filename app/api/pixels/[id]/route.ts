import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { metaPixelService } from '@/lib/services/meta-pixel.service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, pixelId, accessToken } = await request.json()

    const pixel = await prisma.pixel.findUnique({
      where: { id: params.id },
    })

    if (!pixel || pixel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Pixel não encontrado' },
        { status: 404 }
      )
    }

    // Não validar o token na atualização - apenas validar formato básico
    if (accessToken && accessToken.trim().length === 0) {
      return NextResponse.json(
        { error: 'Token de integração não pode estar vazio' },
        { status: 400 }
      )
    }

    const updated = await prisma.pixel.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(pixelId && { pixelId }),
        ...(accessToken && { accessToken }),
      },
      select: {
        id: true,
        name: true,
        pixelId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar pixel:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pixel' },
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
    const pixel = await prisma.pixel.findUnique({
      where: { id: params.id },
    })

    if (!pixel || pixel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Pixel não encontrado' },
        { status: 404 }
      )
    }

    await prisma.pixel.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar pixel:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar pixel' },
      { status: 500 }
    )
  }
}



