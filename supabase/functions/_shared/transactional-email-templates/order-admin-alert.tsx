import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Max Rico'

interface OrderAdminAlertProps {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  orderId?: string
  totalEur?: string
  deliveryMethod?: string
  city?: string
  address?: string
  scheduledFor?: string
  notes?: string
  items?: Array<{ name: string; qty: number; price: string }>
}

const OrderAdminAlertEmail = ({
  customerName, customerEmail, customerPhone, orderId, totalEur,
  deliveryMethod, city, address, scheduledFor, notes, items = [],
}: OrderAdminAlertProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Nuevo pedido recibido en {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>🔔 Nuevo pedido</Heading>
        </Section>
        <Section style={content}>
          <Text style={text}><strong>Cliente:</strong> {customerName || '—'}</Text>
          <Text style={text}><strong>Email:</strong> {customerEmail || '—'}</Text>
          <Text style={text}><strong>Teléfono:</strong> {customerPhone || '—'}</Text>
          {orderId && <Text style={text}><strong>Pedido:</strong> {orderId}</Text>}
          <Hr style={hr} />
          <Text style={text}><strong>Entrega:</strong> {deliveryMethod === 'domicilio' ? 'A domicilio' : 'Recogida'}</Text>
          {city && <Text style={text}><strong>Ciudad:</strong> {city}</Text>}
          {address && <Text style={text}><strong>Dirección:</strong> {address}</Text>}
          {scheduledFor && <Text style={text}><strong>Fecha:</strong> {scheduledFor}</Text>}
          {notes && <Text style={text}><strong>Notas:</strong> {notes}</Text>}
          {items.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Productos</Heading>
              {items.map((it, i) => (
                <Text key={i} style={text}>{it.qty} × {it.name} — {it.price}</Text>
              ))}
            </>
          )}
          {totalEur && (
            <>
              <Hr style={hr} />
              <Text style={total}>Total: {totalEur}</Text>
            </>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderAdminAlertEmail,
  subject: (d: any) => `Nuevo pedido${d?.orderId ? ` ${d.orderId}` : ''} — ${d?.totalEur || ''}`,
  displayName: 'Alerta de pedido (admin)',
  to: 'maxrico@maxrico.es',
  previewData: {
    customerName: 'Ana García',
    customerEmail: 'ana@example.com',
    customerPhone: '+34 600 000 000',
    orderId: 'ORD-12345',
    totalEur: '24,90 €',
    deliveryMethod: 'domicilio',
    city: 'Madrid',
    address: 'Calle Mayor 1',
    scheduledFor: 'Sábado 3 mayo, 11:00',
    items: [{ name: 'PandeBono x6', qty: 2, price: '9,90 €' }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0 }
const container = { maxWidth: '560px', margin: '0 auto' }
const header = { backgroundColor: '#E31837', padding: '20px', textAlign: 'center' as const }
const brand = { fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }
const content = { padding: '24px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '12px 0 8px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '4px 0' }
const total = { fontSize: '18px', fontWeight: 'bold', color: '#E31837', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '16px 0' }
