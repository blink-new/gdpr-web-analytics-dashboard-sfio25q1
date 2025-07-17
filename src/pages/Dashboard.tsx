import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/hooks/useAnalytics'
import { analytics } from '@/lib/analytics'
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe, 
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar
} from 'lucide-react'

export default function Dashboard() {
  const analyticsData = useAnalytics()

  // Create metrics array with real data
  const metrics = [
    {
      title: 'Total Visitors',
      value: analyticsData.totalVisitors.toLocaleString(),
      change: '+12.5%', // Mock change for now
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Page Views',
      value: analyticsData.pageViews.toLocaleString(),
      change: '+8.2%', // Mock change for now
      trend: 'up' as const,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. Session',
      value: analyticsData.avgSession,
      change: '-2.1%', // Mock change for now
      trend: 'down' as const,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Bounce Rate',
      value: analyticsData.bounceRate,
      change: '-5.4%', // Mock change for now
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const handleTestClick = () => {
    analytics.trackEvent('button_click', { button: 'test_analytics', location: 'dashboard' })
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return Smartphone
      case 'tablet':
        return Monitor
      default:
        return Monitor
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor your website performance with privacy-first analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm" onClick={handleTestClick}>
                <Download className="h-4 w-4 mr-2" />
                Test Analytics
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                GDPR Compliant
              </Badge>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <Card key={metric.title} className="bg-white shadow-sm border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        {metric.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPages.length > 0 ? (
                    analyticsData.topPages.map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-slate-500 w-4">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{page.path}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-slate-600">{page.views.toLocaleString()}</span>
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${page.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No page views yet</p>
                      <p className="text-sm">Start browsing to see analytics data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Device Stats */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.deviceStats.length > 0 ? (
                    analyticsData.deviceStats.map((device) => {
                      const DeviceIcon = getDeviceIcon(device.device)
                      return (
                        <div key={device.device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <DeviceIcon className="h-5 w-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-900">{device.device}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-600">{device.percentage}%</span>
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${device.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No device data yet</p>
                      <p className="text-sm">Visit pages to see device analytics</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Data */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Visitors by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {analyticsData.recentVisitors.length > 0 ? (
                  analyticsData.recentVisitors.map((visitor) => (
                    <div key={visitor.country} className="text-center p-4 rounded-lg bg-slate-50">
                      <div className="text-2xl mb-2">{visitor.flag}</div>
                      <p className="text-sm font-medium text-slate-900">{visitor.country}</p>
                      <p className="text-lg font-bold text-blue-600">{visitor.visitors.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-500">
                    <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No geographic data yet</p>
                    <p className="text-sm">Visitor location data will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}