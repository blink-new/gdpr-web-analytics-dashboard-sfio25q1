import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { X, Cookie, Shield } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = async () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    await analytics.trackCookieConsent(allAccepted)
    setIsVisible(false)
    
    // Track initial page view now that consent is given
    if (allAccepted.analytics) {
      analytics.trackPageView(window.location.pathname)
    }
  }

  const handleAcceptSelected = async () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    await analytics.trackCookieConsent(preferences)
    setIsVisible(false)
    
    // Track initial page view if analytics consent is given
    if (preferences.analytics) {
      analytics.trackPageView(window.location.pathname)
    }
  }

  const handleRejectAll = async () => {
    const rejected = {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
    }
    localStorage.setItem('cookie-consent', JSON.stringify(rejected))
    await analytics.trackCookieConsent(rejected)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cookie className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Cookie Preferences</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-slate-600 mb-6">
            We use cookies to enhance your experience and analyze our website traffic. 
            You can customize your preferences below or accept all cookies.
          </p>

          {showDetails && (
            <div className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">Necessary Cookies</h3>
                  <p className="text-sm text-slate-600">Required for basic site functionality</p>
                </div>
                <Switch checked={preferences.necessary} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">Analytics Cookies</h3>
                  <p className="text-sm text-slate-600">Help us understand how visitors use our site</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">Marketing Cookies</h3>
                  <p className="text-sm text-slate-600">Used to deliver personalized advertisements</p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Shield className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide Details' : 'Customize'}
            </Button>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleRejectAll}>
                Reject All
              </Button>
              {showDetails && (
                <Button variant="outline" onClick={handleAcceptSelected}>
                  Accept Selected
                </Button>
              )}
              <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}