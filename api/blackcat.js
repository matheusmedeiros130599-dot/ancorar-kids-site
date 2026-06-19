// Endpoint de webhook para Black Cat (Vercel Serverless Function)
// - Lê o corpo bruto para validar assinatura HMAC (recomendado)
// - Define a variável de ambiente `BLACKCAT_WEBHOOK_SECRET` no Vercel
const crypto = require('crypto');

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const raw = await getRawBody(req);

      // Header onde a assinatura pode vir (ajuste conforme doc da Black Cat)
      const signatureHeader = req.headers['x-blackcat-signature'] || req.headers['x-signature'] || req.headers['stripe-signature'];

      const webhookSecret = process.env.BLACKCAT_WEBHOOK_SECRET;
      if (webhookSecret && signatureHeader) {
        const expected = crypto.createHmac('sha256', webhookSecret).update(raw).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signatureHeader, 'hex'))) {
          console.warn('Invalid webhook signature');
          return res.status(400).json({ error: 'invalid_signature' });
        }
      }

      // Parse payload (JSON expected)
      let payload = {};
      try { payload = JSON.parse(raw.toString()); } catch (e) { payload = { raw: raw.toString() }; }

      console.log('Black Cat webhook received:', payload);

      // TODO: implementar lógica de processamento (salvar em DB, atualizar pedido, etc.)

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Erro no endpoint Black Cat:', err);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  res.status(200).send('Black Cat endpoint');
};

// Necessário para Vercel não parsear o body automaticamente
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
