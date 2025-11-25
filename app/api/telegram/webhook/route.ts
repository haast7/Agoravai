import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { telegramService } from '@/lib/services/telegram.service'
import { metaPixelService } from '@/lib/services/meta-pixel.service'

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    console.log('\n🔔 [Telegram Webhook] ===== NOVA REQUISIÇÃO =====')
    console.log('🔔 [Telegram Webhook] Update recebido:', JSON.stringify(update, null, 2))

    // Processar entrada no canal
    if (update.message?.new_chat_members) {
      const chatId = update.message.chat.id.toString()
      const newMembers = update.message.new_chat_members

      console.log(`🔔 [Telegram Webhook] Nova entrada detectada!`)
      console.log(`   Chat ID: ${chatId}`)
      console.log(`   Novos membros: ${newMembers.length}`)

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
        console.log(`✅ [Telegram Webhook] Canal encontrado: "${channel.name}"`)
        console.log(`   Funis associados: ${channel.funnels.length}`)
        for (const member of newMembers) {
          console.log(`   Processando membro: ${member.first_name} (@${member.username || 'sem username'})`)
          // Processar para cada funil associado ao canal
          for (const funnel of channel.funnels) {
            console.log(`   📝 Criando evento EnterChannel para funil: "${funnel.name}"`)
            // Registrar evento de entrada
            const event = await prisma.event.create({
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
            console.log(`   ✅ Evento salvo: ID=${event.id}, Type=${event.type}, Funnel=${funnel.name}`)

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

      console.log(`🔔 [Telegram Webhook] Saída detectada!`)
      console.log(`   Chat ID: ${chatId}`)
      console.log(`   Membro que saiu: ${leftMember.first_name} (@${leftMember.username || 'sem username'})`)

      const channel = await prisma.channel.findFirst({
        where: {
          channelId: chatId,
        },
        include: {
          funnels: true,
        },
      })

      if (channel) {
        console.log(`✅ [Telegram Webhook] Canal encontrado: "${channel.name}"`)
        console.log(`   Funis associados: ${channel.funnels.length}`)
        for (const funnel of channel.funnels) {
          console.log(`   📝 Criando evento ExitChannel para funil: "${funnel.name}"`)
          // Registrar evento de saída
          const event = await prisma.event.create({
            data: {
              funnelId: funnel.id,
              type: 'ExitChannel',
              metadata: {
                userId: leftMember.id,
                username: leftMember.username,
              },
            },
          })
          console.log(`   ✅ Evento salvo: ID=${event.id}, Type=${event.type}, Funnel=${funnel.name}`)

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
      } else {
        console.log(`⚠️ [Telegram Webhook] Canal não encontrado para Chat ID: ${chatId}`)
        console.log(`   Verifique se o channelId no sistema corresponde ao ID do grupo`)
      }
    }

    // Se não for entrada nem saída, logar para debug
    if (!update.message?.new_chat_members && !update.message?.left_chat_member) {
      console.log(`ℹ️ [Telegram Webhook] Update recebido mas não é entrada/saída (tipo: ${update.message?.text ? 'mensagem' : 'outro'})`)
    }

    console.log('🔔 [Telegram Webhook] ===== FIM DA REQUISIÇÃO =====\n')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro no webhook do Telegram:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}




