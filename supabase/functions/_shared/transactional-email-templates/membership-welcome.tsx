import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Max Rico'

interface MembershipWelcomeProps {
  customerName?: string
}

const MembershipWelcomeEmail = ({ customerName }: MembershipWelcomeProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Bienvenido al Club {SITE_NAME} 👑</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>👑 Club {SITE_NAME}</Heading>
          <Text style={tagline}>Bienvenido a la familia</Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>
            ¡Bienvenido{customerName ? `, ${customerName}` : ''}!
          </Heading>
          <Text style={text}>
            Tu membresía anual del <strong>Club Max Rico</strong> ya está activa.
            A partir de ahora disfrutarás de:
          </Text>
          <Text style={bullet}>✓ Precios exclusivos de socio en todo el catálogo</Text>
          <Text style={bullet}>✓ Acceso prioritario a nuevos productos</Text>
          <Text style={bullet}>✓ Promociones y eventos solo para socios</Text>
          <Hr style={hr} />
          <Text style={text}>
            Inicia sesión en <strong>maxrico.es</strong> para ver tus precios de socio aplicados automáticamente.
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>{SITE_NAME} · maxrico.es</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: MembershipWelcomeEmail,
  subject: '¡Bienvenido al Club Max Rico! 👑',
  displayName: 'Bienvenida al Club',
  previewData: { customerName: 'Ana' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0 }
const container = { maxWidth: '560px', margin: '0 auto' }
const header = { backgroundColor: '#FFD400', padding: '28px', textAlign: 'center' as const }
const brand = { fontSize: '26px', fontWeight: 800, color: '#000000', margin: 0 }
const tagline = { fontSize: '13px', color: '#000000', margin: '6px 0 0' }
const content = { padding: '28px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#000000', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 12px' }
const bullet = { fontSize: '14px', color: '#333333', lineHeight: '1.8', margin: '4px 0' }
const hr = { borderColor: '#eeeeee', margin: '20px 0' }
const footer = { padding: '16px 24px', backgroundColor: '#f6f6f6', textAlign: 'center' as const }
const footerText = { fontSize: '12px', color: '#666666', margin: 0 }
