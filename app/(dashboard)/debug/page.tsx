'use client'

import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Card } from '@/components/ui/Card'

export default function DebugPage() {
  const [funnels, setFunnels] = useState<any[]>([])
  const [events, setEvents] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [funnelsData, eventsData] = await Promise.all([
        apiRequest<any[]>('/debug/funnels'),
        apiRequest<any>('/debug/events'),
      ])
      setFunnels(funnelsData.funnels || [])
      setEvents(eventsData)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-white p-8">Carregando...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">🔍 Debug - Script IDs e Eventos</h1>

      {/* Funis e Script IDs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">📋 Funis e Script IDs</h2>
        {funnels.length === 0 ? (
          <p className="text-gray-400">Nenhum funil encontrado.</p>
        ) : (
          <div className="space-y-4">
            {funnels.map((funnel) => (
              <div key={funnel.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                <h3 className="text-lg font-semibold text-white mb-2">{funnel.name}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Script ID:</span>
                    <code className="ml-2 text-yellow-400 font-mono">{funnel.trackingScriptId}</code>
                  </div>
                  <div>
                    <span className="text-gray-400">URL do Script:</span>
                    <code className="ml-2 text-blue-400 font-mono break-all">
                      {funnel.scriptUrl}
                    </code>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-400">Script para usar no HTML:</span>
                    <pre className="mt-2 p-3 bg-black rounded text-green-400 text-xs overflow-x-auto">
{`<script src="${funnel.scriptUrl}"></script>`}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Eventos Salvos */}
      {events && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">📊 Eventos Salvos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">PageView</div>
              <div className="text-2xl font-bold text-white">{events.totalEvents?.PageView || 0}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Click</div>
              <div className="text-2xl font-bold text-white">{events.totalEvents?.Click || 0}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">EnterChannel</div>
              <div className="text-2xl font-bold text-white">{events.totalEvents?.EnterChannel || 0}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">ExitChannel</div>
              <div className="text-2xl font-bold text-white">{events.totalEvents?.ExitChannel || 0}</div>
            </div>
          </div>

          {events.recentEvents && events.recentEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Eventos Recentes</h3>
              <div className="space-y-2">
                {events.recentEvents.slice(0, 10).map((event: any) => (
                  <div key={event.id} className="border border-gray-700 rounded p-3 bg-gray-800 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-yellow-400 font-semibold">{event.type}</span>
                        <span className="text-gray-400 ml-2">em {event.funnelName}</span>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(event.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    {event.url && (
                      <div className="text-gray-400 text-xs mt-1 break-all">{event.url}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}



