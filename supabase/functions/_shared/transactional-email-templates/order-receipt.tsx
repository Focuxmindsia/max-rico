import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'MaxRico'
const SITE_URL = 'https://maxrico.es'
const LOGO_URL = 'https://maxrico.es/maxrico-logo.png'

interface OrderReceiptProps {
  customerName?: string
  orderId?: string
  totalEur?: string
  deliveryMethod?: string
  scheduledFor?: string
  notes?: string
  items?: Array<{ name: string; qty: number; price: string }>
}

const OrderReceiptEmail = ({
  customerName,
  orderId,
  totalEur,
  deliveryMethod,
  scheduledFor,
  notes,
  items = [],
}: OrderReceiptProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu pedido en {SITE_NAME} ha sido confirmado</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Link href={SITE_URL} style={logoLink}>
            <Img src={LOGO_URL} alt={SITE_NAME} width="96" height="96" style={logo} />
          </Link>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={tagline}>Gastronomía artesana colombiana</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            ¡Gracias{customerName ? `, ${customerName}` : ''}!
          </Heading>
          <Text style={text}>
            Hemos recibido tu pedido correctamente. Te lo prepararemos con todo el cariño.
          </Text>

          {orderId && (
            <Text style={meta}>
              <strong>Pedido:</strong> {orderId}
            </Text>
          )}
          {deliveryMethod && (
            <Text style={meta}>
              <strong>Entrega:</strong> {deliveryMethod === 'domicilio' ? 'A domicilio' : 'Recogida en tienda'}
            </Text>
          )}
          {scheduledFor && (
            <Text style={meta}>
              <strong>Fecha:</strong> {scheduledFor}
            </Text>
          )}

          {items.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Tu pedido</Heading>
              {items.map((it, i) => (
                <Text key={i} style={itemLine}>
                  {it.qty} × {it.name} — <strong>{it.price}</strong>
                </Text>
              ))}
            </>
          )}

          {notes && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Nota opcional del cliente</Heading>
              <Text style={notesBox}>{notes}</Text>
            </>
          )}

          {totalEur && (
            <>
              <Hr style={hr} />
              <Text style={total}>Total: {totalEur}</Text>
            </>
          )}

          <Hr style={hr} />
          <Text style={text}>
            Si necesitas cualquier cosa, escríbenos por WhatsApp al <strong>+34 695 798 632</strong>.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            <Link href={SITE_URL} style={footerLink}>{SITE_NAME} · maxrico.es</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderReceiptEmail,
  subject: 'Confirmación de tu pedido en MaxRico',
  displayName: 'Recibo de pedido',
  previewData: {
    customerName: 'Ana',
    orderId: 'ORD-12345',
    totalEur: '24,90 €',
    deliveryMethod: 'domicilio',
    scheduledFor: 'Sábado 3 mayo, 11:00',
    notes: 'Quiero más queso y más salsa picante, por favor.',
    items: [
      { name: 'PandeBono x6', qty: 2, price: '9,90 €' },
      { name: 'Buñuelos x10', qty: 1, price: '5,10 €' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '0' }
const header = { backgroundColor: '#FFD400', padding: '24px', textAlign: 'center' as const }
const logoLink = { display: 'inline-block', textDecoration: 'none' }
const logo = { display: 'block', margin: '0 auto 8px', borderRadius: '50%' }
const brand = { fontSize: '28px', fontWeight: 800, color: '#000000', margin: 0, letterSpacing: '-0.5px' }
const tagline = { fontSize: '13px', color: '#000000', margin: '4px 0 0' }
const content = { padding: '28px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 12px' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#000000', margin: '12px 0 8px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 12px' }
const meta = { fontSize: '14px', color: '#333333', margin: '4px 0' }
const itemLine = { fontSize: '14px', color: '#333333', margin: '4px 0' }
const notesBox = { fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: '4px 0', padding: '10px 12px', backgroundColor: '#FFF8DB', borderLeft: '3px solid #FFD400', borderRadius: '4px' }
const total = { fontSize: '18px', fontWeight: 'bold', color: '#E31837', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '20px 0' }
const footer = { padding: '16px 24px', backgroundColor: '#f6f6f6', textAlign: 'center' as const }
const footerText = { fontSize: '12px', color: '#666666', margin: 0 }
const footerLink = { color: '#666666', textDecoration: 'none' }
