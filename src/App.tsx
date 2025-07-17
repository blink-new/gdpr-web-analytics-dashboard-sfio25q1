import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import PrivacySettings from '@/pages/PrivacySettings'
import CookieConsent from '@/components/CookieConsent'
import { analytics } from '@/lib/analytics'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize analytics service
    console.log('Analytics service initialized')
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/privacy" element={<PrivacySettings />} />
        </Routes>
        <CookieConsent />
        <Toaster />
      </div>
    </Router>
  )
}

export default App