import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAnalytics } from '@/hooks/useAnalytics'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  MousePointer,
  ExternalLink,
  Calendar,
  Filter
} from 'lucide-react'

const chartData = [
  { time: '00:00', visitors: 45, pageviews: 120 },
  { time: '04:00', visitors: 23, pageviews: 67 },
  { time: '08:00', visitors: 189, pageviews: 456 },
  { time: '12:00', visitors: 234, pageviews: 678 },
  { time: '16:00', visitors: 345, pageviews: 890 },
  { time: '20:00', visitors: 167, pageviews: 432 },
]

const referrerData = [
  { source: 'Google Search', visitors: 3456, percentage: 45, type: 'search' },
  { source: 'Direct', visitors: 2134, percentage: 28, type: 'direct' },
  { source: 'Social Media', visitors: 1234, percentage: 16, type: 'social' },
  { source: 'Email', visitors: 567, percentage: 7, type: 'email' },
  { source: 'Other', visitors: 345, percentage: 4, type: 'other' },
]

const realtimeEvents = [
  { time: '2 seconds ago', event: 'Page view', page: '/products', location: 'New York, US' },
  { time: '5 seconds ago', event: 'Page view', page: '/', location: 'London, UK' },
  { time: '12 seconds ago', event: 'Click', page: '/contact', location: 'Berlin, DE' },
  { time: '18 seconds ago', event: 'Page view', page: '/about', location: 'Toronto, CA' },
  { time: '25 seconds ago', event: 'Page view', page: '/blog', location: 'Sydney, AU' },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const analyticsData = useAnalytics()

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Detailed Analytics</h1>
              <p className="text-slate-600 mt-1">Deep dive into your website performance metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {timeRange === '24h' ? 'Last 24 hours' : 'Last 7 days'}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="realtime">Real-time</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Traffic Chart */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Traffic Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center space-y-1">
                          <div 
                            className="w-full bg-blue-600 rounded-t"
                            style={{ height: `${(data.visitors / 350) * 200}px` }}
                          ></div>
                          <div 
                            className="w-full bg-blue-300 rounded-b"
                            style={{ height: `${(data.pageviews / 900) * 100}px` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600 mt-2">{data.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span className="text-sm text-slate-600">Visitors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-300 rounded"></div>
                      <span className="text-sm text-slate-600">Page Views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Referrer Sources */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrerData.map((referrer) => (
                      <div key={referrer.source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            referrer.type === 'search' ? 'bg-green-500' :
                            referrer.type === 'direct' ? 'bg-blue-500' :
                            referrer.type === 'social' ? 'bg-purple-500' :
                            referrer.type === 'email' ? 'bg-orange-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm font-medium text-slate-900">{referrer.source}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-slate-600">{referrer.visitors.toLocaleString()}</span>
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${referrer.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 w-8">{referrer.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Users</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">127</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-100">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Pages/Session</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">2.4</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-100">
                        <MousePointer className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Avg. Duration</p>
                        <p className="text-3xl font-bold text-purple-600 mt-1">4m 12s</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-100">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            {event.event}
                          </Badge>
                          <span className="text-sm font-medium text-slate-900">{event.page}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">{event.location}</p>
                          <p className="text-xs text-slate-400">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Behavior Analytics</h3>
                <p className="text-slate-600">User behavior tracking and heatmaps coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="acquisition" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">User Acquisition</h3>
                <p className="text-slate-600">Advanced acquisition metrics and campaign tracking coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}