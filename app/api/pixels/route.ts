import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { metaPixelService } from '@/lib/services/meta-pixel.service'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const pixels = await prisma.pixel.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        pixelId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(pixels)
  } catch (error: any) {
    console.error('Erro ao buscar pixels:', error)
    
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao banco de dados' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar pixels',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, pixelId, accessToken } = await request.json()

    if (!name || !pixelId || !accessToken) {
      return NextResponse.json(
        { error: 'Nome, ID do Pixel e Token são obrigatórios' },
        { status: 400 }
      )
    }

    // Não validar o token na criação - o token de Conversions API não tem permissão
    // para acessar informações do pixel via Graph API. A validação real acontecerá
    // quando tentar enviar eventos. Apenas validar formato básico.
    
    if (!pixelId || pixelId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Pixel ID é obrigatório' },
        { status: 400 }
      )
    }
    
    if (!accessToken || accessToken.trim().length === 0) {
      return NextResponse.json(
        { error: 'Token de integração é obrigatório' },
        { status: 400 }
      )
    }

    const pixel = await prisma.pixel.create({
      data: {
        name,
        pixelId,
        accessToken,
        userId: user!.id,
      },
      select: {
        id: true,
        name: true,
        pixelId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(pixel)
  } catch (error: any) {
    console.error('Erro ao criar pixel:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pixel' },
      { status: 500 }
    )
  }
}



