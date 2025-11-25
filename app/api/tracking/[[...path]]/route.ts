import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Não incluir Access-Control-Allow-Credentials quando usar wildcard
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: getCorsHeaders(request) })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  const corsHeaders = getCorsHeaders(request)
  // Log imediato para garantir que a função está sendo chamada
  console.log('\n🚀 [Tracking Script] ROTA CHAMADA!')
  
  try {
    // Resolver params se for Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params
    console.log(`📥 [Tracking Script] Params recebidos:`, resolvedParams)
    
    // Extrair scriptId do path
    // O path pode ser: ['16939524-4f25-4165-9cef-4b3e6e2d478d.js'] ou ['16939524-4f25-4165-9cef-4b3e6e2d478d']
    const pathArray = resolvedParams.path || []
    const fullPath = pathArray.join('/')
    
    // Não processar rotas específicas como /event
    if (fullPath === 'event' || fullPath.startsWith('event/')) {
      return new NextResponse('Not Found', { status: 404, headers: corsHeaders })
    }
    
    let scriptId = fullPath.replace('.js', '').trim()
    
    console.log(`🔍 [Tracking Script] Path completo: "${fullPath}"`)
    console.log(`🔍 [Tracking Script] Script ID processado: "${scriptId}"`)
    
    // Se não houver scriptId, retornar 404
    if (!scriptId) {
      console.log(`❌ [Tracking Script] Script ID vazio`)
      return new NextResponse('Script ID não fornecido', { status: 404, headers: corsHeaders })
    }
    
    console.log(`\n🔍 [Tracking Script] Buscando funil com scriptId: "${scriptId}"`)
    
    // Primeiro, listar TODOS os funis para debug
    if (process.env.NODE_ENV === 'development') {
      const allFunnels = await prisma.funnel.findMany({
        select: {
          id: true,
          name: true,
          trackingScriptId: true,
        },
        take: 20,
      })
      console.log(`\n📋 [Tracking Script] TOTAL de funis no banco: ${allFunnels.length}`)
      allFunnels.forEach((f, index) => {
        const match = f.trackingScriptId === scriptId ? ' ⭐ MATCH!' : ''
        console.log(`   ${index + 1}. Nome: "${f.name}" | Script ID: "${f.trackingScriptId}"${match}`)
      })
    }
    
    const funnel = await prisma.funnel.findUnique({
      where: { trackingScriptId: scriptId },
      include: {
        pixel: true,
        domain: true,
        channel: true,
      },
    })

    if (!funnel) {
      console.log(`\n❌ [Tracking Script] Funil NÃO encontrado para scriptId: "${scriptId}"`)
      
      // Tentar buscar sem case sensitivity
      const allFunnels = await prisma.funnel.findMany({
        select: {
          id: true,
          name: true,
          trackingScriptId: true,
        },
        take: 20,
      })
      
      const similar = allFunnels.find(f => 
        f.trackingScriptId.toLowerCase() === scriptId.toLowerCase()
      )
      
      if (similar) {
        console.log(`\n⚠️  [Tracking Script] ATENÇÃO: Encontrado Script ID similar (case diferente):`)
        console.log(`   Procurado: "${scriptId}"`)
        console.log(`   Encontrado: "${similar.trackingScriptId}"`)
        console.log(`   Use este: http://localhost:3000/api/tracking/${similar.trackingScriptId}.js`)
      }
      
      return new NextResponse('Funil não encontrado', { status: 404, headers: corsHeaders })
    }
    
    console.log(`✅ [Tracking Script] Funil encontrado: "${funnel.name}" (ID: ${funnel.id})`)

    // Verificar se as relações necessárias existem
    if (!funnel.pixel || !funnel.domain || !funnel.channel) {
      console.error(`Relações faltando para funil ${funnel.id}:`, {
        hasPixel: !!funnel.pixel,
        hasDomain: !!funnel.domain,
        hasChannel: !!funnel.channel,
      })
      return new NextResponse('Configuração do funil incompleta', { status: 500, headers: corsHeaders })
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/api/tracking/event`
    
    console.log(`📝 [Tracking Script] URL de tracking gerada: ${trackingUrl}`)

    // Gerar script JavaScript que será injetado na página
    const script = `
(function() {
  const scriptId = '${scriptId}';
  const trackingUrl = '${trackingUrl}';
  const funnelId = '${funnel.id}';
  
  // Rastrear PageView quando a página carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }
  
  function trackPageView() {
    console.log('[Tracking] Iniciando trackPageView...');
    sendEvent('PageView', {
      url: window.location.href,
      referer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }
  
  // Rastrear cliques em links do Telegram
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && target.href) {
      const href = target.href;
      const isTelegramLink = href.includes('t.me') || href.includes('telegram.me');
      
      if (isTelegramLink) {
        console.log('[Tracking] Clique detectado em link do Telegram:', href);
        
        // Criar payload do evento
        const payload = {
          scriptId: scriptId,
          funnelId: funnelId,
          type: 'Click',
          url: href,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        };
        
        // Usar fetch com keepalive para garantir envio mesmo durante navegação
        const payloadStr = JSON.stringify(payload);
        console.log('[Tracking] Enviando evento Click para:', trackingUrl);
        console.log('[Tracking] Payload:', payloadStr);
        
        fetch(trackingUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payloadStr,
          keepalive: true,
          credentials: 'omit',
        }).then(function(response) {
          console.log('[Tracking] Evento Click enviado:', response.ok ? '✅ Sucesso' : '❌ Falhou', 'Status:', response.status);
          if (!response.ok) {
            return response.text().then(function(text) {
              console.error('[Tracking] Resposta de erro:', text);
            });
          }
          return response.text().then(function(text) {
            console.log('[Tracking] Resposta do servidor:', text);
          });
        }).catch(function(error) {
          console.error('[Tracking] Erro ao enviar evento Click:', error);
        });
      }
    }
  }, true); // Usar capture phase para pegar o evento antes de outros handlers
  
  function sendEvent(type, data) {
    console.log('[Tracking] sendEvent chamado:', type, data);
    const payload = {
      scriptId,
      funnelId,
      type,
      ...data,
      timestamp: new Date().toISOString(),
    };
    
    const payloadStr = JSON.stringify(payload);
    console.log('[Tracking] Enviando para:', trackingUrl);
    console.log('[Tracking] Payload:', payloadStr);
    
    // Usar fetch com keepalive (mais confiável para JSON que sendBeacon)
    fetch(trackingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payloadStr,
      keepalive: true, // Garante envio mesmo durante navegação
      credentials: 'omit', // Não enviar credentials para evitar erro CORS
    }).then(function(response) {
      console.log('[Tracking] Evento', type, 'enviado:', response.ok ? '✅ Sucesso' : '❌ Falhou', 'Status:', response.status);
      if (!response.ok) {
        return response.text().then(function(text) {
          console.error('[Tracking] Resposta de erro do servidor:', text);
        });
      }
      return response.text().then(function(text) {
        console.log('[Tracking] Resposta do servidor:', text);
      });
    }).catch(function(error) {
      console.error('[Tracking] Erro ao enviar evento:', error);
    });
  }
})();
`

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error('Erro ao gerar script:', error)
    console.error('Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      path: params instanceof Promise ? 'resolving...' : params?.path,
    })
    return new NextResponse(
      `Erro ao gerar script: ${process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'}`,
      { status: 500, headers: corsHeaders }
    )
  }
}

