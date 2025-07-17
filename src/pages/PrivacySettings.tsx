import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Cookie, 
  Database, 
  Trash2, 
  Download, 
  Eye,
  Lock,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    cookieConsent: true,
    dataAnonymization: true,
    ipAnonymization: true,
    dataRetention: true,
    userTracking: false,
    crossSiteTracking: false,
    thirdPartySharing: false,
    analyticsOptOut: false
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const privacyFeatures = [
    {
      title: 'Cookie Consent Management',
      description: 'Manage user consent for different types of cookies',
      icon: Cookie,
      status: 'active',
      setting: 'cookieConsent'
    },
    {
      title: 'Data Anonymization',
      description: 'Automatically anonymize personal data in analytics',
      icon: Eye,
      status: 'active',
      setting: 'dataAnonymization'
    },
    {
      title: 'IP Address Anonymization',
      description: 'Mask the last octet of IP addresses',
      icon: Globe,
      status: 'active',
      setting: 'ipAnonymization'
    },
    {
      title: 'Data Retention Controls',
      description: 'Automatically delete old data after specified period',
      icon: Clock,
      status: 'active',
      setting: 'dataRetention'
    }
  ]

  const complianceStatus = [
    { requirement: 'Cookie Consent Banner', status: 'compliant', description: 'Active and properly configured' },
    { requirement: 'Data Processing Agreement', status: 'compliant', description: 'Terms clearly defined' },
    { requirement: 'Right to be Forgotten', status: 'compliant', description: 'Data deletion tools available' },
    { requirement: 'Data Portability', status: 'compliant', description: 'Export functionality enabled' },
    { requirement: 'Privacy by Design', status: 'compliant', description: 'Built-in privacy protections' }
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Settings</h1>
              <p className="text-slate-600 mt-1">Manage GDPR compliance and data protection settings</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              GDPR Compliant
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Privacy Controls */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {privacyFeatures.map((feature) => (
                    <div key={feature.title} className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{feature.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings[feature.setting as keyof typeof settings]}
                        onCheckedChange={(checked) => handleSettingChange(feature.setting, checked)}
                      />
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900">Advanced Privacy Options</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Disable User Tracking</p>
                        <p className="text-sm text-slate-600">Stop collecting individual user behavior data</p>
                      </div>
                      <Switch
                        checked={settings.userTracking}
                        onCheckedChange={(checked) => handleSettingChange('userTracking', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Block Cross-Site Tracking</p>
                        <p className="text-sm text-slate-600">Prevent tracking across different websites</p>
                      </div>
                      <Switch
                        checked={settings.crossSiteTracking}
                        onCheckedChange={(checked) => handleSettingChange('crossSiteTracking', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Third-Party Data Sharing</p>
                        <p className="text-sm text-slate-600">Share anonymized data with partners</p>
                      </div>
                      <Switch
                        checked={settings.thirdPartySharing}
                        onCheckedChange={(checked) => handleSettingChange('thirdPartySharing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Analytics Opt-Out</p>
                        <p className="text-sm text-slate-600">Allow users to opt-out of all analytics</p>
                      </div>
                      <Switch
                        checked={settings.analyticsOptOut}
                        onCheckedChange={(checked) => handleSettingChange('analyticsOptOut', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                      <div className="text-center">
                        <Download className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium text-slate-900">Export Data</p>
                        <p className="text-sm text-slate-600 mt-1">Download all collected data</p>
                      </div>
                    </Button>

                    <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                      <div className="text-center">
                        <Trash2 className="h-6 w-6 mx-auto mb-2 text-red-600" />
                        <p className="font-medium text-slate-900">Delete Data</p>
                        <p className="text-sm text-slate-600 mt-1">Remove specific user data</p>
                      </div>
                    </Button>

                    <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                      <div className="text-center">
                        <Lock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="font-medium text-slate-900">Anonymize</p>
                        <p className="text-sm text-slate-600 mt-1">Convert data to anonymous</p>
                      </div>
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Data Retention Policy</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Analytics data is automatically deleted after 26 months to comply with GDPR requirements.
                          Users can request immediate deletion at any time.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Status */}
            <div className="space-y-6">
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceStatus.map((item) => (
                      <div key={item.requirement} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{item.requirement}</p>
                          <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-800">Fully Compliant</p>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your analytics setup meets all GDPR requirements
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Cookie className="h-4 w-4 mr-2" />
                    Reset Cookie Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Privacy Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Update Privacy Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}