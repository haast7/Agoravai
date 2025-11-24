import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function POST(
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

    // Testar postback enviando uma requisição
    try {
      const response = await fetch(postback.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: postback.type,
          test: true,
          timestamp: new Date().toISOString(),
        }),
      })

      return NextResponse.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      })
    } catch (fetchError: any) {
      return NextResponse.json({
        success: false,
        error: fetchError.message,
      })
    }
  } catch (error) {
    console.error('Erro ao testar postback:', error)
    return NextResponse.json(
      { error: 'Erro ao testar postback' },
      { status: 500 }
    )
  }
}



