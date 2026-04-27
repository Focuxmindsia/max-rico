/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderReceipt } from './order-receipt.tsx'
import { template as orderAdminAlert } from './order-admin-alert.tsx'
import { template as membershipWelcome } from './membership-welcome.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-receipt': orderReceipt,
  'order-admin-alert': orderAdminAlert,
  'membership-welcome': membershipWelcome,
}
