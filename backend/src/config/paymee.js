// backend/config/paymee.js
module.exports = {
  apiKey: process.env.PAYMEE_API_KEY,
  apiToken: process.env.PAYMEE_API_TOKEN,
  sandbox: process.env.NODE_ENV !== 'production',
  urls: {
    base: process.env.PAYMEE_BASE_URL || 'https://sandbox.paymee.tn/api/v2',
    checkout: '/checkout/create',
    verify: '/checkout/verify'
  },
  webhookSecret: process.env.PAYMEE_WEBHOOK_SECRET
};