import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'gdpr-web-analytics-dashboard-sfio25q1',
  authRequired: true
})

export default blink