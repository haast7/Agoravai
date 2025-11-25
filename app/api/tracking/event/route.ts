import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { metaPixelService } from '@/lib/services/meta-pixel.service'
import type { EventType } from '@/lib/types'

// Função para gerar headers CORS dinâmicos baseados na origem da requisição
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin')
  // Permitir origens locais comuns em desenvolvimento
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
  ]
  
  // Se a origem estiver na lista permitida, usar ela; senão usar wildcard
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*'
  
  // IMPORTANTE: Se usar wildcard (*), não pode usar credentials: true
  // Se usar origem específica, pode usar credentials: true se necessário
  // Como estamos usando credentials: 'omit' no cliente, não precisamos de credentials: true
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Não incluir Access-Control-Allow-Credentials quando usar wildcard
    // Isso evita conflito quando o cliente não envia credentials
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) })
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request)
  
  try {
    // Log detalhado da requisição
    console.log(`\n📥 [Tracking Event] ===== NOVA REQUISIÇÃO =====`)
    console.log(`📥 [Tracking Event] Método: ${request.method}`)
    console.log(`📥 [Tracking Event] URL: ${request.url}`)
    console.log(`📥 [Tracking Event] Origin: ${request.headers.get('origin')}`)
    console.log(`📥 [Tracking Event] Content-Type: ${request.headers.get('content-type')}`)
    
    const body = await request.json()
    const { scriptId, funnelId, type, url, referer, userAgent } = body

    console.log(`📥 [Tracking Event] Body recebido:`, JSON.stringify(body, null, 2))

    if (!scriptId && !funnelId) {
      console.error(`❌ [Tracking Event] scriptId ou funnelId faltando`)
      return NextResponse.json(
        { error: 'scriptId ou funnelId é obrigatório' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log(`✅ [Tracking Event] Evento válido recebido:`, {
      scriptId,
      funnelId,
      type,
      url: url?.substring(0, 50),
    })

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
      console.error(`[Tracking Event] Funil não encontrado:`, {
        scriptId,
        funnelId,
      })
      
      // Listar funis disponíveis para debug
      if (process.env.NODE_ENV === 'development' && scriptId) {
        const allFunnels = await prisma.funnel.findMany({
          select: {
            id: true,
            name: true,
            trackingScriptId: true,
          },
          take: 10,
        })
        console.error('Funis disponíveis:', allFunnels.map(f => ({
          name: f.name,
          trackingScriptId: f.trackingScriptId,
        })))
      }
      
      return NextResponse.json(
        { error: 'Funil não encontrado' },
        { status: 404, headers: corsHeaders }
      )
    }

    console.log(`[Tracking Event] Funil encontrado: ${funnel.name}, salvando evento ${type}`)

    // Validar URL (se fornecida)
    // Em desenvolvimento, ser mais flexível com URLs locais
    // Para eventos de Click, sempre permitir (é o link do Telegram)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isLocalUrl = url && (
      url.includes('localhost') || 
      url.includes('127.0.0.1') || 
      url.includes('0.0.0.0') ||
      url.startsWith('file://')
    )
    const isTelegramLink = url && (url.includes('t.me') || url.includes('telegram.me'))
    const isClickEvent = type === 'Click'

    // Para eventos de Click, sempre permitir (é o link do Telegram)
    // Para outros eventos, validar URL se necessário
    if (!isClickEvent && url && funnel.urls.length > 0 && !(isDevelopment && isLocalUrl)) {
      const domain = funnel.domain.url
      const isValidUrl = funnel.urls.some((funnelUrl) => {
        const fullUrl = funnelUrl.startsWith('http') 
          ? funnelUrl 
          : `https://${domain}${funnelUrl.startsWith('/') ? '' : '/'}${funnelUrl}`
        return url.includes(fullUrl) || url.includes(funnelUrl)
      })

      if (!isValidUrl) {
        console.error(`[Tracking Event] URL não autorizada:`, {
          url,
          domain,
          allowedUrls: funnel.urls,
          type,
        })
        return NextResponse.json(
          { error: 'URL não autorizada para este funil' },
          { status: 403, headers: corsHeaders }
        )
      }
    } else if (isDevelopment && isLocalUrl) {
      console.log(`[Tracking Event] URL local detectada em desenvolvimento, permitindo: ${url}`)
    } else if (isClickEvent && isTelegramLink) {
      console.log(`[Tracking Event] Evento de Click em link do Telegram, permitindo: ${url}`)
    }

    // Obter IP do cliente
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
      || request.headers.get('x-real-ip') 
      || 'unknown'

    // Registrar evento no banco
    const event = await prisma.event.create({
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

    console.log(`✅ [Tracking Event] Evento salvo com sucesso no banco:`, {
      id: event.id,
      type: event.type,
      funnelId: event.funnelId,
      url: event.url,
      createdAt: event.createdAt,
    })
    console.log(`📊 [Tracking Event] ===== FIM DA REQUISIÇÃO =====\n`)

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

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error) {
    console.error('Erro ao processar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar evento' },
      { status: 500, headers: corsHeaders }
    )
  }
}



