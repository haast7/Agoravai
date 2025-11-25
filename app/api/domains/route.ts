import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const domains = await prisma.domain.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(domains)
  } catch (error) {
    console.error('Erro ao buscar domínios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar domínios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      )
    }

    // Validar formato do domínio
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    if (!domainRegex.test(url)) {
      return NextResponse.json(
        { error: 'Formato de domínio inválido' },
        { status: 400 }
      )
    }

    const domain = await prisma.domain.create({
      data: {
        url,
        userId: user!.id,
      },
    })

    return NextResponse.json(domain)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Domínio já cadastrado' },
        { status: 400 }
      )
    }
    console.error('Erro ao criar domínio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar domínio' },
      { status: 500 }
    )
  }
}





