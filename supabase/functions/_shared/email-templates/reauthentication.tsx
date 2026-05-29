/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu código de verificación</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>MAX RICO</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Confirma tu identidad</Heading>
          <Text style={text}>Usa el siguiente código para confirmar tu identidad:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={footer}>
            Este código caduca en breve. Si no lo solicitaste, ignora este correo.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0 }
const container = { maxWidth: '560px', margin: '0 auto', border: '1px solid #eeeeee' }
const header = { backgroundColor: '#FFD400', padding: '20px', textAlign: 'center' as const }
const brand = { fontSize: '24px', fontWeight: 900, color: '#141414', margin: 0, letterSpacing: '1px' }
const content = { padding: '28px 28px 32px' }
const h1 = { fontSize: '22px', fontWeight: 800, color: '#141414', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 18px' }
const codeStyle = {
  fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 900,
  color: '#141414', backgroundColor: '#FFF7CC', padding: '14px 20px',
  borderRadius: '8px', display: 'inline-block', letterSpacing: '4px', margin: '0 0 24px',
}
const footer = { fontSize: '12px', color: '#888888', margin: '28px 0 0' }
