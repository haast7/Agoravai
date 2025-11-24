import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  try {
    const scriptId = params.scriptId.replace('.js', '')
    
    const funnel = await prisma.funnel.findUnique({
      where: { trackingScriptId: scriptId },
      include: {
        pixel: true,
        domain: true,
        channel: true,
      },
    })

    if (!funnel) {
      return new NextResponse('Funil não encontrado', { status: 404 })
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/api/tracking/event`

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
    sendEvent('PageView', {
      url: window.location.href,
      referer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }
  
  // Rastrear cliques em links do Telegram
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && (target.href.includes('t.me') || target.href.includes('telegram.me'))) {
      sendEvent('Click', {
        url: target.href,
        pageUrl: window.location.href,
      });
    }
  });
  
  function sendEvent(type, data) {
    const payload = {
      scriptId,
      funnelId,
      type,
      ...data,
      timestamp: new Date().toISOString(),
    };
    
    // Enviar via fetch (não bloqueante)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackingUrl, JSON.stringify(payload));
    } else {
      fetch(trackingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }
})();
`

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar script:', error)
    return new NextResponse('Erro ao gerar script', { status: 500 })
  }
}



