import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

// Sending via Resend (https://resend.com)
const SITE_NAME = 'Max Rico'
const FROM_EMAIL = 'clientes@maxrico.es'
const FROM_ADDRESS = `${SITE_NAME} <${FROM_EMAIL}>`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
    console.error('Missing required environment variables', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasResend: !!resendApiKey,
    })
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization')
  const internalServiceKey = req.headers.get('x-internal-service-key')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (bearerToken !== supabaseServiceKey && internalServiceKey !== supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let templateName: string
  let recipientEmail: string
  let idempotencyKey: string
  let messageId: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    messageId = crypto.randomUUID()
    idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId
    if (body.templateData && typeof body.templateData === 'object') templateData = body.templateData
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!templateName) {
    return new Response(JSON.stringify({ error: 'templateName is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    return new Response(
      JSON.stringify({ error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  const effectiveRecipient = template.to || recipientEmail
  if (!effectiveRecipient) {
    return new Response(JSON.stringify({ error: 'recipientEmail is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedEmail = effectiveRecipient.toLowerCase()

  // Suppression check (fail-closed)
  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails').select('id').eq('email', normalizedEmail).maybeSingle()

  if (suppressionError) {
    console.error('Suppression check failed', suppressionError)
    return new Response(JSON.stringify({ error: 'Failed to verify suppression status' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId, template_name: templateName,
      recipient_email: effectiveRecipient, status: 'suppressed',
    })
    return new Response(JSON.stringify({ success: false, reason: 'email_suppressed' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get or create unsubscribe token
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens').select('token, used_at').eq('email', normalizedEmail).maybeSingle()

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else {
    unsubscribeToken = generateToken()
    await supabase.from('email_unsubscribe_tokens').upsert(
      { token: unsubscribeToken, email: normalizedEmail },
      { onConflict: 'email', ignoreDuplicates: true },
    )
    const { data: storedToken } = await supabase
      .from('email_unsubscribe_tokens').select('token').eq('email', normalizedEmail).maybeSingle()
    if (storedToken) unsubscribeToken = storedToken.token
  }

  // Render template
  const bodyHtml = await renderAsync(React.createElement(template.component, templateData))
  const plainText = await renderAsync(
    React.createElement(template.component, templateData), { plainText: true },
  )

  const resolvedSubject = typeof template.subject === 'function'
    ? template.subject(templateData) : template.subject

  // Append unsubscribe footer
  const unsubscribeUrl = `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${unsubscribeToken}`
  const htmlWithFooter = bodyHtml.replace(
    '</body>',
    `<div style="text-align:center;padding:16px;font-size:11px;color:#999;font-family:Arial,sans-serif;">
      <a href="${unsubscribeUrl}" style="color:#999;">Darse de baja</a>
    </div></body>`,
  )
  const textWithFooter = `${plainText}\n\n---\nDarse de baja: ${unsubscribeUrl}`

  // Log pending
  await supabase.from('email_send_log').insert({
    message_id: messageId, template_name: templateName,
    recipient_email: effectiveRecipient, status: 'pending',
  })

  // Send via Resend
  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [effectiveRecipient],
        subject: resolvedSubject,
        html: htmlWithFooter,
        text: textWithFooter,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }),
    })

    const resendJson = await resendRes.json().catch(() => ({}))

    if (!resendRes.ok) {
      console.error('Resend send failed', resendRes.status, resendJson)
      await supabase.from('email_send_log').insert({
        message_id: messageId, template_name: templateName,
        recipient_email: effectiveRecipient, status: 'failed',
        error_message: `Resend ${resendRes.status}: ${JSON.stringify(resendJson).slice(0, 500)}`,
      })
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendJson }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    await supabase.from('email_send_log').insert({
      message_id: messageId, template_name: templateName,
      recipient_email: effectiveRecipient, status: 'sent',
      metadata: { provider: 'resend', provider_id: resendJson.id ?? null },
    })

    console.log('Email sent via Resend', { templateName, effectiveRecipient, id: resendJson.id })
    return new Response(
      JSON.stringify({ success: true, provider: 'resend', id: resendJson.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    console.error('Resend request threw', e)
    await supabase.from('email_send_log').insert({
      message_id: messageId, template_name: templateName,
      recipient_email: effectiveRecipient, status: 'failed',
      error_message: `Exception: ${String(e).slice(0, 500)}`,
    })
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
