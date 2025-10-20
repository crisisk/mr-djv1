# Webhook Security

The Mister DJ backend verifies all inbound automation webhooks with an HMAC signature. This section explains how to configure the
shared secrets, how verification works internally and how to rotate credentials without downtime.

## Signature format

Webhooks must include the `X-MRDJ-Signature` header. The value follows the Stripe-style format:

```
t=<unix_timestamp>,v1=<hex_digest>
```

- `t` – seconds since epoch (UTC).
- `v1` – hex encoded HMAC-SHA256 signature of the string `<timestamp>.<raw_request_body>`.
- The signature is calculated with the shared secret that belongs to the integration.
- The backend enforces a five minute tolerance window for the timestamp to protect against replay attacks.

## Configuration

| Integration        | Environment variable                     | Notes                                               |
| ------------------ | ---------------------------------------- | --------------------------------------------------- |
| RentGuy callbacks  | `RENTGUY_WEBHOOK_SECRETS`                | Comma separated list (current secret first).        |
| Personalization    | `PERSONALIZATION_WEBHOOK_SECRETS`        | Comma separated list of accepted shared secrets.    |

The values are parsed into arrays so you can keep multiple secrets active at the same time. This makes it possible to cut over
automations gradually.

## Rotating shared secrets

1. **Add the next secret** to the appropriate environment variable as the second item, keeping the current secret first. For
   example: `RENTGUY_WEBHOOK_SECRETS="current_secret,next_secret"`.
2. **Deploy the backend** – both secrets are now accepted. Webhook providers can start using the new secret.
3. **Update the external system** (RentGuy, n8n, …) so it uses the new secret when signing requests.
4. **Monitor the logs** or `/integrations/*/webhook` responses – when you no longer see requests signed with the old secret you
   can remove it from the list and redeploy.

During rotation, the backend reports which secret index matched (`matchedSecretIndex`) in the integration logs to help auditing
and observability.

## Failure modes

- Missing or malformed `X-MRDJ-Signature` header → `401` response with `code = missing_signature` / `missing_digest`.
- Timestamp outside the 5 minute window → `401` and `code = timestamp_out_of_range`.
- Unknown secret / digest mismatch → `401` and `code = signature_mismatch`.
- Secrets not configured → `503` and `code = missing_secret`.

Always alert on non-2xx responses from the webhook endpoints so rotations or configuration drift are caught early.
