import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { telegramService } from '@/lib/services/telegram.service'
import { metaPixelService } from '@/lib/services/meta-pixel.service'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()

    // Processar entrada no canal
    if (update.message?.new_chat_members) {
      const chatId = update.message.chat.id.toString()
      const newMembers = update.message.new_chat_members

      // Buscar canal pelo chatId
      const channel = await prisma.channel.findFirst({
        where: {
          channelId: chatId,
        },
        include: {
          funnels: {
            include: {
              pixel: true,
            },
          },
        },
      })

      if (channel) {
        for (const member of newMembers) {
          // Processar para cada funil associado ao canal
          for (const funnel of channel.funnels) {
            // Registrar evento de entrada
            await prisma.event.create({
              data: {
                funnelId: funnel.id,
                type: 'EnterChannel',
                metadata: {
                  userId: member.id,
                  username: member.username,
                  firstName: member.first_name,
                },
              },
            })

            // Enviar evento para Meta Pixel
            if (funnel.pixel) {
              await metaPixelService.sendEnterChannelEvent(
                funnel.pixel.pixelId,
                funnel.pixel.accessToken,
                undefined,
                undefined,
                {
                  funnel_id: funnel.id,
                  funnel_name: funnel.name,
                  user_id: member.id.toString(),
                }
              )
            }

            // Disparar postbacks
            const postbacks = await prisma.postback.findMany({
              where: {
                funnelId: funnel.id,
                type: 'EnterChannel',
              },
            })

            for (const postback of postbacks) {
              try {
                await fetch(postback.url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event: 'EnterChannel',
                    funnelId: funnel.id,
                    userId: member.id,
                    timestamp: new Date().toISOString(),
                  }),
                })
              } catch (error) {
                console.error('Erro ao disparar postback:', error)
              }
            }
          }
        }
      }
    }

    // Processar saída do canal
    if (update.message?.left_chat_member) {
      const chatId = update.message.chat.id.toString()
      const leftMember = update.message.left_chat_member

      const channel = await prisma.channel.findFirst({
        where: {
          channelId: chatId,
        },
        include: {
          funnels: true,
        },
      })

      if (channel) {
        for (const funnel of channel.funnels) {
          // Registrar evento de saída
          await prisma.event.create({
            data: {
              funnelId: funnel.id,
              type: 'ExitChannel',
              metadata: {
                userId: leftMember.id,
                username: leftMember.username,
              },
            },
          })

          // Disparar postbacks
          const postbacks = await prisma.postback.findMany({
            where: {
              funnelId: funnel.id,
              type: 'ExitChannel',
            },
          })

          for (const postback of postbacks) {
            try {
              await fetch(postback.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  event: 'ExitChannel',
                  funnelId: funnel.id,
                  userId: leftMember.id,
                  timestamp: new Date().toISOString(),
                }),
              })
            } catch (error) {
              console.error('Erro ao disparar postback:', error)
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro no webhook do Telegram:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}



