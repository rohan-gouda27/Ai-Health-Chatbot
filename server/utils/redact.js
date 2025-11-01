// Simple PII redaction for emails and phone numbers
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_REGEX = /(\+?\d[\d\s\-()]{6,}\d)/g;

function redactPII(text) {
  if (!text || typeof text !== 'string') return text;
  let out = text.replace(EMAIL_REGEX, '[redacted email]');
  out = out.replace(PHONE_REGEX, '[redacted phone]');
  return out;
}

module.exports = { redactPII };




