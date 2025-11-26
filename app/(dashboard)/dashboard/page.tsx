'use client'

import { useEffect, useState } from 'react'
import { analyticsApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import {
  Eye,
  Zap,
  UserPlus,
  UserMinus,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [retention, setRetention] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'PageView' | 'Click' | 'EnterChannel' | 'ExitChannel'>('PageView')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      else setRefreshing(true)
      
      console.log('🔄 [Dashboard] Carregando dados...')
      const [metricsData, chartDataRes, retentionData] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getChart({ type: activeTab }),
        analyticsApi.getRetention(),
      ])
      
      console.log('✅ [Dashboard] Dados carregados:', {
        pageviews: metricsData?.pageviews,
        clicks: metricsData?.clicks,
        entries: metricsData?.entries,
        chartDataPoints: chartDataRes?.length,
      })
      
      setMetrics(metricsData)
      setChartData(chartDataRes)
      setRetention(retentionData)
    } catch (error) {
      console.error('❌ [Dashboard] Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleTabChange = async (tab: typeof activeTab) => {
    setActiveTab(tab)
    try {
      const data = await analyticsApi.getChart({ type: tab })
      setChartData(data)
    } catch (error) {
      console.error('Erro ao carregar gráfico:', error)
    }
  }

  if (loading) {
    return <div className="text-white">Carregando...</div>
  }

  const metricCards = [
    {
      title: 'Pageviews',
      value: metrics?.pageviews || 0,
      change: metrics?.pageviewsChange || 0,
      icon: Eye,
      secondary: {
        label: 'Conversão geral para Entradas',
        value: `${(metrics?.conversionRate || 0).toFixed(0)}%`,
        progress: metrics?.conversionRate || 0,
      },
    },
    {
      title: 'Clicks na página',
      value: metrics?.clicks || 0,
      change: metrics?.clicksChange || 0,
      icon: Zap,
      secondary: {
        label: 'Taxa de Cliques por Pageviews',
        value: `${(metrics?.clickRate || 0).toFixed(0)}%`,
        progress: metrics?.clickRate || 0,
      },
    },
    {
      title: 'Entradas',
      value: metrics?.entries || 0,
      change: metrics?.entriesChange || 0,
      icon: UserPlus,
      secondary: {
        label: 'Taxa de Entradas por Cliques',
        value: `${(metrics?.entryRate || 0).toFixed(0)}%`,
        progress: metrics?.entryRate || 0,
      },
    },
    {
      title: 'Saídas',
      value: metrics?.exits || 0,
      change: metrics?.exitsChange || 0,
      icon: UserMinus,
      secondary: {
        label: 'Taxa de Retenção',
        value: `${(metrics?.retentionRate || 0).toFixed(2)}%`,
        progress: metrics?.retentionRate || 0,
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={() => loadData(false)}
          disabled={refreshing}
          className={cn(
            'flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90',
            refreshing && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon
          const isNegative = card.change < 0

          return (
            <Card key={card.title}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {card.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    {isNegative ? (
                      <TrendingDown className="text-red-500" size={16} />
                    ) : (
                      <TrendingUp className="text-green-500" size={16} />
                    )}
                    <span className={cn(isNegative ? 'text-red-500' : 'text-green-500')}>
                      {Math.abs(card.change).toFixed(0)}% do período anterior
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-400">{card.secondary.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-700">
                        <div
                          className="h-2 bg-primary"
                          style={{ width: `${Math.min(card.secondary.progress, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {card.secondary.value}
                      </span>
                    </div>
                  </div>
                </div>
                <Icon className="text-gray-600" size={24} />
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-bold text-white">Overview de Métricas</h2>
        <div className="mb-4 flex gap-2">
          {(['PageView', 'Click', 'EnterChannel', 'ExitChannel'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              {tab === 'PageView' ? 'Pageviews' : tab === 'Click' ? 'Clicks' : tab === 'EnterChannel' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#005599"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-bold text-white">Taxa de Retenção Diária</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Dia
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Entradas
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Saídas
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Retenção
                </th>
              </tr>
            </thead>
            <tbody>
              {retention.map((row) => (
                <tr key={row.day} className="border-b border-gray-800">
                  <td className="px-4 py-3 text-white">{row.day}</td>
                  <td className="px-4 py-3 text-white">{row.entries}</td>
                  <td className="px-4 py-3 text-white">{row.exits}</td>
                  <td
                    className={cn(
                      'px-4 py-3 font-medium',
                      row.retention >= 80
                        ? 'text-green-500'
                        : row.retention >= 50
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    )}
                  >
                    {row.retention.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}




