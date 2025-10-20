const REQUIRED_ENV = Object.freeze({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://test-user:test-pass@localhost:5432/mrdj',
  REDIS_URL: 'redis://localhost:6379/0',
  MAIL_PROVIDER: 'postmark',
  MAIL_API_KEY: 'test-mail-key',
  MAIL_FROM_ADDRESS: 'noreply@example.com',
  MAIL_REPLY_TO: 'support@example.com',
  MAIL_TEMPLATES_CONTACT: 'tmpl-contact',
  MAIL_TEMPLATES_BOOKING: 'tmpl-booking',
  RENTGUY_API_BASE_URL: 'https://rentguy.example/api',
  RENTGUY_API_KEY: 'rentguy-test-key',
  RENTGUY_WORKSPACE_ID: 'workspace-test',
  SEVENSA_SUBMIT_URL: 'https://sevensa.example/submit',
  N8N_PERSONALIZATION_WEBHOOK_URL: 'https://n8n.example/webhook',
  N8N_SURVEY_WEBHOOK_URL: 'https://n8n.example/webhook/surveys',
  SURVEY_RESPONSE_BASE_URL: 'https://feedback.example/respond',
  SEO_AUTOMATION_API_URL: 'https://seo.example/api',
  SEO_AUTOMATION_API_KEY: 'seo-test-key',
  SEO_AUTOMATION_KEYWORDSET_ID: 'keywordset-test',
  SEO_AUTOMATION_REGION: 'Noord-Brabant',
  SEO_AUTOMATION_APPROVAL_EMAIL: 'marketing@example.com',
  CITY_AUTOMATION_LLM_PROVIDER: 'openai',
  CITY_AUTOMATION_LLM_MODEL: 'gpt-4.1-mini',
  CITY_AUTOMATION_LLM_API_KEY: 'city-automation-test-key',
  CITY_AUTOMATION_DRY_RUN: 'false'
});

function buildRequiredEnv(overrides = {}) {
  return { ...REQUIRED_ENV, ...overrides };
}

module.exports = {
  REQUIRED_ENV,
  buildRequiredEnv
};
