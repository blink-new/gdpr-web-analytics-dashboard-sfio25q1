import blink from './blink'

// Types for analytics data
export interface PageView {
  id?: string
  userId?: string
  sessionId: string
  pagePath: string
  pageTitle?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  country?: string
  deviceType?: string
  browser?: string
  os?: string
  screenWidth?: number
  screenHeight?: number
  timestamp: number
}

export interface Session {
  id: string
  userId?: string
  sessionStart: number
  sessionEnd?: number
  pageCount: number
  bounce: boolean
  duration?: number
  entryPage?: string
  exitPage?: string
  referrer?: string
  country?: string
  deviceType?: string
  browser?: string
  os?: string
}

export interface AnalyticsEvent {
  id?: string
  userId?: string
  sessionId: string
  eventName: string
  eventData?: any
  pagePath?: string
  timestamp: number
}

export interface CookieConsent {
  id?: string
  userId?: string
  sessionId: string
  necessary: boolean
  analytics: boolean
  marketing: boolean
  ipAddress?: string
  timestamp: number
}

class AnalyticsService {
  private sessionId: string
  private sessionStart: number
  private pageCount: number = 0
  private consentGiven: boolean = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStart = Date.now()
    this.initializeConsent()
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeConsent() {
    const consent = localStorage.getItem('cookie-consent')
    if (consent) {
      const consentData = JSON.parse(consent)
      this.consentGiven = consentData.analytics === true
    }
  }

  private async initializeSession() {
    if (!this.canTrack()) return

    try {
      const deviceInfo = this.getDeviceInfo()
      const session: Partial<Session> = {
        id: this.sessionId,
        sessionStart: this.sessionStart,
        pageCount: 0,
        bounce: true,
        entryPage: window.location.pathname,
        referrer: document.referrer || undefined,
        ...deviceInfo
      }

      // Try to get user ID if authenticated
      try {
        const user = await blink.auth.me()
        session.userId = user.id
      } catch {
        // User not authenticated, continue without user ID
      }

      // Store session in localStorage
      const existingSessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]')
      existingSessions.push(session)
      localStorage.setItem('analytics_sessions', JSON.stringify(existingSessions.slice(-100)))
      
      console.log('Session initialized in localStorage:', session.id)
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
  }

  // Check if analytics tracking is allowed
  private canTrack(): boolean {
    return this.consentGiven
  }

  // Get device information
  private getDeviceInfo() {
    const userAgent = navigator.userAgent
    let deviceType = 'desktop'
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile'
    }

    // Simple browser detection
    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // Simple OS detection
    let os = 'unknown'
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'

    return { deviceType, browser, os }
  }

  // Track page view
  async trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.canTrack()) return

    try {
      const deviceInfo = this.getDeviceInfo()
      const pageView: PageView = {
        id: `pv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: this.sessionId,
        pagePath,
        pageTitle: pageTitle || document.title,
        referrer: document.referrer || undefined,
        userAgent: navigator.userAgent,
        ...deviceInfo,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timestamp: Date.now()
      }

      // Try to get user ID if authenticated
      try {
        const user = await blink.auth.me()
        pageView.userId = user.id
      } catch {
        // User not authenticated, continue without user ID
      }

      this.pageCount++

      // Store in localStorage
      const existingViews = JSON.parse(localStorage.getItem('analytics_pageviews') || '[]')
      existingViews.push(pageView)
      localStorage.setItem('analytics_pageviews', JSON.stringify(existingViews.slice(-1000)))
      
      console.log('Page view stored in localStorage:', pageView.id)

      // Update session with new page count and bounce status
      await this.updateSession(pagePath)

      console.log('Page view tracked:', pageView)
      return pageView
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  // Track custom event
  async trackEvent(eventName: string, eventData?: any, pagePath?: string) {
    if (!this.canTrack()) return

    try {
      const event: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: this.sessionId,
        eventName,
        eventData,
        pagePath: pagePath || window.location.pathname,
        timestamp: Date.now()
      }

      // Try to get user ID if authenticated
      try {
        const user = await blink.auth.me()
        event.userId = user.id
      } catch {
        // User not authenticated, continue without user ID
      }

      // Store in localStorage
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]')
      existingEvents.push(event)
      localStorage.setItem('analytics_events', JSON.stringify(existingEvents.slice(-1000)))
      
      console.log('Event stored in localStorage:', event.id)

      console.log('Event tracked:', event)
      return event
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // Track cookie consent
  async trackCookieConsent(consent: { necessary: boolean; analytics: boolean; marketing: boolean }) {
    try {
      const consentRecord: CookieConsent = {
        id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: this.sessionId,
        ...consent,
        timestamp: Date.now()
      }

      // Try to get user ID if authenticated
      try {
        const user = await blink.auth.me()
        consentRecord.userId = user.id
      } catch {
        // User not authenticated, continue without user ID
      }

      // Update internal consent state
      this.consentGiven = consent.analytics

      // Store in localStorage
      const existingConsents = JSON.parse(localStorage.getItem('analytics_consents') || '[]')
      existingConsents.push(consentRecord)
      localStorage.setItem('analytics_consents', JSON.stringify(existingConsents.slice(-100)))
      
      console.log('Cookie consent stored in localStorage:', consentRecord.id)

      console.log('Cookie consent tracked:', consentRecord)
      return consentRecord
    } catch (error) {
      console.error('Failed to track cookie consent:', error)
    }
  }

  // Update session in localStorage
  private async updateSession(exitPage?: string) {
    try {
      const currentTime = Date.now()
      const duration = Math.floor((currentTime - this.sessionStart) / 1000)
      
      const existingSessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]')
      const sessionIndex = existingSessions.findIndex((s: any) => s.id === this.sessionId)
      
      if (sessionIndex !== -1) {
        existingSessions[sessionIndex] = {
          ...existingSessions[sessionIndex],
          sessionEnd: currentTime,
          pageCount: this.pageCount,
          bounce: this.pageCount <= 1,
          duration: duration,
          exitPage: exitPage || window.location.pathname
        }
        localStorage.setItem('analytics_sessions', JSON.stringify(existingSessions))
      }
      
      console.log('Session updated in localStorage:', this.sessionId)
    } catch (error) {
      console.warn('Failed to update session in localStorage:', error)
    }
  }

  // Get session info
  getSessionInfo(): Partial<Session> {
    return {
      id: this.sessionId,
      sessionStart: this.sessionStart,
      pageCount: this.pageCount,
      bounce: this.pageCount <= 1,
      duration: Math.floor((Date.now() - this.sessionStart) / 1000)
    }
  }

  // Get analytics data from localStorage
  getStoredData() {
    return {
      pageViews: JSON.parse(localStorage.getItem('analytics_pageviews') || '[]'),
      events: JSON.parse(localStorage.getItem('analytics_events') || '[]'),
      consents: JSON.parse(localStorage.getItem('analytics_consents') || '[]'),
      sessions: JSON.parse(localStorage.getItem('analytics_sessions') || '[]')
    }
  }

  // Clear all stored data (for GDPR compliance)
  clearAllData() {
    localStorage.removeItem('analytics_pageviews')
    localStorage.removeItem('analytics_events')
    localStorage.removeItem('analytics_consents')
    localStorage.removeItem('analytics_sessions')
    console.log('All analytics data cleared')
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// Auto-track page views on route changes
let currentPath = window.location.pathname

const trackPageChange = () => {
  const newPath = window.location.pathname
  if (newPath !== currentPath) {
    currentPath = newPath
    analytics.trackPageView(newPath)
  }
}

// Listen for route changes
window.addEventListener('popstate', trackPageChange)

// Override pushState and replaceState to catch programmatic navigation
const originalPushState = history.pushState
const originalReplaceState = history.replaceState

history.pushState = function(...args) {
  originalPushState.apply(history, args)
  setTimeout(trackPageChange, 0)
}

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args)
  setTimeout(trackPageChange, 0)
}

// Handle session end when user leaves the page
window.addEventListener('beforeunload', () => {
  // Use sendBeacon for reliable tracking on page unload
  const sessionInfo = analytics.getSessionInfo()
  const data = JSON.stringify({
    sessionId: sessionInfo.id,
    sessionEnd: Date.now(),
    pageCount: sessionInfo.pageCount,
    bounce: sessionInfo.bounce,
    duration: sessionInfo.duration,
    exitPage: window.location.pathname
  })
  
  // Try to send final session update
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/session-end', data)
  }
})

export default analytics