/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma tu correo en Max Rico</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>MAX RICO</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Confirma tu correo</Heading>
          <Text style={text}>
            ¡Gracias por registrarte en{' '}
            <Link href={siteUrl} style={link}><strong>Max Rico</strong></Link>!
          </Text>
          <Text style={text}>
            Por favor confirma tu dirección de correo ({recipient}) pulsando el botón:
          </Text>
          <Button style={button} href={confirmationUrl}>Confirmar correo</Button>
          <Text style={footer}>
            Si no creaste una cuenta, puedes ignorar este correo.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0 }
const container = { maxWidth: '560px', margin: '0 auto', border: '1px solid #eeeeee' }
const header = { backgroundColor: '#FFD400', padding: '20px', textAlign: 'center' as const }
const brand = { fontSize: '24px', fontWeight: 900, color: '#141414', margin: 0, letterSpacing: '1px' }
const content = { padding: '28px 28px 32px' }
const h1 = { fontSize: '22px', fontWeight: 800, color: '#141414', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 18px' }
const link = { color: '#E31837', textDecoration: 'underline' }
const button = {
  backgroundColor: '#FFD400', color: '#141414', fontSize: '15px', fontWeight: 700,
  borderRadius: '8px', padding: '14px 24px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#888888', margin: '28px 0 0' }
