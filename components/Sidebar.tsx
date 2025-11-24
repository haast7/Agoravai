'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  BarChart3,
  Send,
  Filter,
  MessageSquare,
  CreditCard,
  Code,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/domains', label: 'Domínios', icon: Globe },
  { href: '/pixels', label: 'Pixels', icon: BarChart3 },
  { href: '/channels', label: 'Canal', icon: Send },
  { href: '/funnels', label: 'Funis', icon: Filter },
  { href: '/messages', label: 'Mensagens', icon: MessageSquare },
  { href: '/subscription', label: 'Assinatura', icon: CreditCard },
  { href: '/postbacks', label: 'Postbacks', icon: Code },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-xl font-bold text-white">
            4
          </div>
          <div>
            <div className="font-bold text-white">TRACKOYOU</div>
            <div className="text-xs text-gray-400">TRACKEAMENTO DE DADOS</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  )
}



