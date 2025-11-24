import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const domain = await prisma.domain.findUnique({
      where: { id: params.id },
    })

    if (!domain || domain.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Domínio não encontrado' },
        { status: 404 }
      )
    }

    await prisma.domain.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar domínio:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar domínio' },
      { status: 500 }
    )
  }
}



