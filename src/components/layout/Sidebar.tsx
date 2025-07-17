import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  Shield, 
  Settings, 
  Activity,
  Users,
  Globe,
  Eye
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Privacy Settings', href: '/privacy', icon: Shield },
]

const stats = [
  { name: 'Active Visitors', value: '1,234', icon: Users },
  { name: 'Page Views', value: '12.4K', icon: Eye },
  { name: 'Countries', value: '45', icon: Globe },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-50 border-r border-slate-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">Analytics</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 py-6 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.name} className="flex items-center">
              <stat.icon className="h-4 w-4 text-slate-400 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{stat.name}</p>
                <p className="text-sm font-medium text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Status */}
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-xs">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-slate-600">GDPR Compliant</span>
        </div>
      </div>
    </div>
  )
}