import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { metaPixelService } from '@/lib/services/meta-pixel.service'
import type { EventType } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scriptId, funnelId, type, url, referer, userAgent } = body

    if (!scriptId && !funnelId) {
      return NextResponse.json(
        { error: 'scriptId ou funnelId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar funil
    const funnel = await prisma.funnel.findUnique({
      where: scriptId 
        ? { trackingScriptId: scriptId }
        : { id: funnelId },
      include: {
        pixel: true,
        domain: true,
      },
    })

    if (!funnel) {
      return NextResponse.json(
        { error: 'Funil não encontrado' },
        { status: 404 }
      )
    }

    // Validar URL (se fornecida)
    if (url && funnel.urls.length > 0) {
      const domain = funnel.domain.url
      const isValidUrl = funnel.urls.some((funnelUrl) => {
        const fullUrl = funnelUrl.startsWith('http') 
          ? funnelUrl 
          : `https://${domain}${funnelUrl.startsWith('/') ? '' : '/'}${funnelUrl}`
        return url.includes(fullUrl) || url.includes(funnelUrl)
      })

      if (!isValidUrl) {
        return NextResponse.json(
          { error: 'URL não autorizada para este funil' },
          { status: 403 }
        )
      }
    }

    // Obter IP do cliente
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
      || request.headers.get('x-real-ip') 
      || 'unknown'

    // Registrar evento no banco
    await prisma.event.create({
      data: {
        funnelId: funnel.id,
        type: type as EventType,
        url: url || null,
        userAgent: userAgent || null,
        ip: ip !== 'unknown' ? ip : null,
        referer: referer || null,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    })

    // Disparar postbacks do tipo correspondente
    const postbackType = type === 'PageView' ? 'ViewPage' 
      : type === 'Click' ? 'ClickButton'
      : type === 'EnterChannel' ? 'EnterChannel'
      : 'ExitChannel'

    const postbacks = await prisma.postback.findMany({
      where: {
        OR: [
          { funnelId: funnel.id, type: postbackType },
          { pixelId: funnel.pixelId, type: postbackType },
        ],
      },
    })

    for (const postback of postbacks) {
      try {
        await fetch(postback.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: type,
            funnelId: funnel.id,
            funnelName: funnel.name,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error('Erro ao disparar postback:', error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar evento' },
      { status: 500 }
    )
  }
}



