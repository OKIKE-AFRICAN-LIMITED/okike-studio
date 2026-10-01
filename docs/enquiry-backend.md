# Enquiry backend integration

The browser posts JSON to `POST /api/enquiry`. The route validates the request, renders escaped HTML and plain text, and sends both versions with the official Resend Node SDK. It returns success only when Resend returns a message ID. That response confirms API acceptance, not inbox delivery.

## Required environment variables

- `RESEND_API_KEY`: a server-only Resend API key with permission to send email.
- `ENQUIRY_FROM_EMAIL`: a sender using a domain that has already been verified in Resend, for example the display-name format `OKIKE Studio <address@verified-domain>`.
- `ENQUIRY_TO_EMAIL`: must be `studio@okike.com`.

Do not prefix these variables with `NEXT_PUBLIC_`. The route uses the visitor's validated address only as `Reply-To`. It never uses visitor input as the sender.

## Delivery behavior

The validated `submission.id` is passed to the Resend SDK as `idempotencyKey`. A failed retry reuses the same key and identical email payload. Editing any submission content causes the browser to create a new key. Resend retains idempotency keys for 24 hours and rejects reuse of a key with a different payload.

Resend SDK errors and thrown exceptions produce a generic `502` response. Provider details and the enquiry payload are not returned to the browser or written to application logs. Missing configuration produces `503`. The confirmation screen appears only after Resend returns a message ID.

## Abuse controls

The boundary enforces a 24 KB request limit, field-length limits, strict package/service validation, and a hidden honeypot. The earlier minimum-completion-time rejection was removed because browser autofill and package-prefilled enquiries can legitimately be submitted quickly.

Production rate limiting still requires a shared durable store or a host-managed rate-limit product. No compatible store or deployment-specific infrastructure is configured in this repository. An in-memory counter is intentionally absent because it cannot reliably coordinate serverless instances.

Before production launch, configure a shared limiter using a privacy-conscious derived key, a modest burst allowance, and expiry. Do not store raw IP addresses in durable keys or application logs.

## Resend setup remaining

1. Add and verify an OKIKE-owned sending domain in Resend, including the DNS records Resend supplies.
2. Create a restricted Resend API key.
3. Configure the three required server-only environment variables on the deployment platform.
4. Deploy and perform one controlled end-to-end test, then confirm API acceptance in Resend and receipt at `studio@okike.com`.
5. Add a shared production rate limiter before public launch.
