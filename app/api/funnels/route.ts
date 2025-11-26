import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware'
import { telegramService } from '@/lib/services/telegram.service'
import { generateTrackingId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const funnels = await prisma.funnel.findMany({
      where: { userId: user!.id },
      include: {
        pixel: {
          select: {
            id: true,
            name: true,
            pixelId: true,
          },
        },
        domain: {
          select: {
            id: true,
            url: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            botName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(funnels)
  } catch (error) {
    console.error('Erro ao buscar funis:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar funis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await authenticateRequest(request)
  if (error) return error

  try {
    const { name, pixelId, domainId, channelId, requestEntry, urls } = await request.json()

    if (!name || !pixelId || !domainId || !channelId) {
      return NextResponse.json(
        { error: 'Nome, Pixel, Domínio e Canal são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar que os recursos pertencem ao usuário
    const [pixel, domain, channel] = await Promise.all([
      prisma.pixel.findUnique({ where: { id: pixelId } }),
      prisma.domain.findUnique({ where: { id: domainId } }),
      prisma.channel.findUnique({ where: { id: channelId } }),
    ])

    if (!pixel || pixel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Pixel não encontrado' },
        { status: 404 }
      )
    }

    if (!domain || domain.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Domínio não encontrado' },
        { status: 404 }
      )
    }

    if (!channel || channel.userId !== user!.id) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      )
    }

    // Validar URLs - pelo menos 1 é obrigatório, máximo 5
    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { error: 'Adicione pelo menos uma URL' },
        { status: 400 }
      )
    }

    if (urls.length > 5) {
      return NextResponse.json(
        { error: 'Máximo de 5 URLs permitidas' },
        { status: 400 }
      )
    }

    // Filtrar URLs vazias
    const validUrls = urls.filter((url: string) => url && url.trim().length > 0)
    
    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'Adicione pelo menos uma URL válida' },
        { status: 400 }
      )
    }

    // Criar funil primeiro para obter o ID
    const trackingScriptId = generateTrackingId()
    console.log(`\n📝 [Funnel Create] Criando funil "${name}" com trackingScriptId: "${trackingScriptId}"`)
    
    const funnel = await prisma.funnel.create({
      data: {
        name,
        pixelId,
        domainId,
        channelId,
        userId: user!.id,
        requestEntry: requestEntry || false,
        urls: validUrls,
        trackingScriptId,
        telegramInviteLink: null, // Será atualizado abaixo
      },
    })
    
    console.log(`✅ [Funnel Create] Funil criado com sucesso!`)
    console.log(`   ID: ${funnel.id}`)
    console.log(`   Nome: ${funnel.name}`)
    console.log(`   Tracking Script ID: ${funnel.trackingScriptId}`)
    console.log(`   URL do Script: http://localhost:3000/api/tracking/${funnel.trackingScriptId}.js`)

    // Gerar link de convite do Telegram com parâmetros de tracking
    let telegramInviteLink = null
    if (channel.channelId) {
      const inviteLink = await telegramService.generateInviteLink(
        channel.botToken,
        channel.channelId
      )
      if (inviteLink) {
        // Adicionar parâmetros de tracking ao link
        const url = new URL(inviteLink)
        url.searchParams.set('funnel', funnel.id)
        url.searchParams.set('ref', 'trackpixel')
        telegramInviteLink = url.toString()
      }
    } else {
      // Se não tiver channelId, gerar link genérico com parâmetros
      telegramInviteLink = `https://t.me/${channel.botName.replace('_bot', '')}?start=funnel_${funnel.id}`
    }

    // Atualizar funil com o link gerado
    const updatedFunnel = await prisma.funnel.update({
      where: { id: funnel.id },
      data: { telegramInviteLink },
      include: {
        pixel: {
          select: {
            id: true,
            name: true,
            pixelId: true,
          },
        },
        domain: {
          select: {
            id: true,
            url: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            botName: true,
          },
        },
      },
    })

    return NextResponse.json(updatedFunnel)
  } catch (error) {
    console.error('Erro ao criar funil:', error)
    return NextResponse.json(
      { error: 'Erro ao criar funil' },
      { status: 500 }
    )
  }
}

