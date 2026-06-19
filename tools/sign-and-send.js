// sign-and-send.js
// Uso: node sign-and-send.js '<json_payload>' 'WEBHOOK_SECRET' 'https://seu-projeto.vercel.app/api/blackcat'

const crypto = require('crypto');
const https = require('https');

const payloadArg = process.argv[2] || JSON.stringify({ test: true });
const secret = process.argv[3] || process.env.BLACKCAT_WEBHOOK_SECRET || '';
const url = process.argv[4] || process.env.WEBHOOK_URL || 'http://localhost:3000/api/blackcat';

const payload = typeof payloadArg === 'string' ? payloadArg : JSON.stringify(payloadArg);
const sig = secret ? crypto.createHmac('sha256', secret).update(payload).digest('hex') : '';

const u = new URL(url);
const options = {
  hostname: u.hostname,
  port: u.port || (u.protocol === 'https:' ? 443 : 80),
  path: u.pathname + (u.search || ''),
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  }
};

if (sig) options.headers['x-blackcat-signature'] = sig;

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (err) => console.error('Request error:', err));
req.write(payload);
req.end();
