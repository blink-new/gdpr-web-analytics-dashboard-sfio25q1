import { useState, useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export interface AnalyticsData {
  totalVisitors: number
  pageViews: number
  avgSession: string
  bounceRate: string
  topPages: Array<{
    path: string
    views: number
    percentage: number
  }>
  deviceStats: Array<{
    device: string
    percentage: number
  }>
  recentVisitors: Array<{
    country: string
    visitors: number
    flag: string
  }>
  realtimeUsers: number
  recentEvents: Array<{
    time: string
    event: string
    page: string
    location: string
  }>
}

export function useAnalytics(): AnalyticsData {
  const [data, setData] = useState<AnalyticsData>({
    totalVisitors: 0,
    pageViews: 0,
    avgSession: '0m 0s',
    bounceRate: '0%',
    topPages: [],
    deviceStats: [],
    recentVisitors: [],
    realtimeUsers: 0,
    recentEvents: []
  })

  useEffect(() => {
    const updateAnalytics = async () => {
      try {
        // Use localStorage as primary storage
        const storedData = analytics.getStoredData()
        const pageViews = storedData.pageViews
        const events = storedData.events
        
        console.log('Fetched analytics data from localStorage:', { pageViews: pageViews.length, events: events.length })

        // Calculate metrics from data
        const uniqueSessions = new Set(pageViews.map((pv: any) => pv.sessionId)).size
        const totalPageViews = pageViews.length

      // Calculate average session duration
      const sessionDurations: { [key: string]: { start: number; end: number; pages: number } } = {}
      
      pageViews.forEach((pv: any) => {
        if (!sessionDurations[pv.sessionId]) {
          sessionDurations[pv.sessionId] = {
            start: pv.timestamp,
            end: pv.timestamp,
            pages: 1
          }
        } else {
          sessionDurations[pv.sessionId].end = Math.max(sessionDurations[pv.sessionId].end, pv.timestamp)
          sessionDurations[pv.sessionId].pages++
        }
      })

      const avgDuration = Object.values(sessionDurations).reduce((acc, session) => {
        return acc + (session.end - session.start)
      }, 0) / Math.max(uniqueSessions, 1)

      const avgSessionFormatted = formatDuration(avgDuration)

      // Calculate bounce rate (sessions with only 1 page view)
      const bouncedSessions = Object.values(sessionDurations).filter(session => session.pages === 1).length
      const bounceRate = uniqueSessions > 0 ? Math.round((bouncedSessions / uniqueSessions) * 100) : 0

      // Calculate top pages
      const pageViewCounts: { [key: string]: number } = {}
      pageViews.forEach((pv: any) => {
        pageViewCounts[pv.pagePath] = (pageViewCounts[pv.pagePath] || 0) + 1
      })

      const topPages = Object.entries(pageViewCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([path, views]) => ({
          path,
          views: views as number,
          percentage: Math.round(((views as number) / totalPageViews) * 100)
        }))

      // Calculate device stats
      const deviceCounts: { [key: string]: number } = {}
      pageViews.forEach((pv: any) => {
        const device = pv.deviceType || 'unknown'
        deviceCounts[device] = (deviceCounts[device] || 0) + 1
      })

      const deviceStats = Object.entries(deviceCounts)
        .map(([device, count]) => ({
          device: device.charAt(0).toUpperCase() + device.slice(1),
          percentage: Math.round(((count as number) / totalPageViews) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage)

      // Calculate country stats (mock data for now since we don't have real geolocation)
      const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada']
      const flags = ['🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇨🇦']
      const recentVisitors = countries.map((country, index) => ({
        country,
        visitors: Math.floor(uniqueSessions * (0.4 - index * 0.08)),
        flag: flags[index]
      }))

      // Recent events for real-time feed
      const recentEvents = [...pageViews, ...events]
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map((item: any) => ({
          time: formatTimeAgo(item.timestamp),
          event: item.eventName || 'Page view',
          page: item.pagePath || '/',
          location: item.country || 'Unknown'
        }))

      setData({
        totalVisitors: uniqueSessions,
        pageViews: totalPageViews,
        avgSession: avgSessionFormatted,
        bounceRate: `${bounceRate}%`,
        topPages,
        deviceStats,
        recentVisitors,
        realtimeUsers: Math.floor(uniqueSessions * 0.1), // Mock active users
        recentEvents
      })
      } catch (error) {
        console.error('Failed to update analytics:', error)
      }
    }

    // Initial load
    updateAnalytics()

    // Update every 30 seconds
    const interval = setInterval(updateAnalytics, 30000)

    return () => clearInterval(interval)
  }, [])

  return data
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`
}