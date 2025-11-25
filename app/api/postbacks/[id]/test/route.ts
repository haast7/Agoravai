import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    // Resolver params se for Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params
    
    const postback = await prisma.postback.findUnique({
      where: { id: resolvedParams.id },
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
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000),
      })

      return NextResponse.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      })
    } catch (fetchError: any) {
      // Tratar diferentes tipos de erro
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Timeout: A requisição demorou mais de 10 segundos',
        })
      }
      
      return NextResponse.json({
        success: false,
        error: fetchError.message || 'Erro ao fazer requisição',
      })
    }
  } catch (error: any) {
    console.error('Erro ao testar postback:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao testar postback',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}



