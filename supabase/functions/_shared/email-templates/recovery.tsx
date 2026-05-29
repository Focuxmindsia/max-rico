/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Restablece tu contraseña en Max Rico</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>MAX RICO</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Restablece tu contraseña</Heading>
          <Text style={text}>
            Recibimos una solicitud para restablecer tu contraseña. Pulsa el botón para crear una nueva.
          </Text>
          <Button style={button} href={confirmationUrl}>Restablecer contraseña</Button>
          <Text style={footer}>
            Si no solicitaste el cambio, puedes ignorar este correo. Tu contraseña no se modificará.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0 }
const container = { maxWidth: '560px', margin: '0 auto', border: '1px solid #eeeeee' }
const header = { backgroundColor: '#FFD400', padding: '20px', textAlign: 'center' as const }
const brand = { fontSize: '24px', fontWeight: 900, color: '#141414', margin: 0, letterSpacing: '1px' }
const content = { padding: '28px 28px 32px' }
const h1 = { fontSize: '22px', fontWeight: 800, color: '#141414', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 18px' }
const button = {
  backgroundColor: '#FFD400', color: '#141414', fontSize: '15px', fontWeight: 700,
  borderRadius: '8px', padding: '14px 24px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#888888', margin: '28px 0 0' }
