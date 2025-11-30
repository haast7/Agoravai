import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { metaPixelService } from '@/lib/services/meta-pixel.service'

export async function POST(
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

    const success = await metaPixelService.testEvent(
      pixel.pixelId,
      pixel.accessToken
    )

    return NextResponse.json({ success })
  } catch (error) {
    console.error('Erro ao testar pixel:', error)
    return NextResponse.json(
      { error: 'Erro ao testar pixel' },
      { status: 500 }
    )
  }
}









