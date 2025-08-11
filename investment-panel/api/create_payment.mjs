// Vercel Serverless Function - Create Payment
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387'

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { transactionAmount, description, payer } = req.body

    // Validações
    if (!transactionAmount || !description || !payer) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' })
    }

    // Gerar chave de idempotência
    const idempotencyKey = require('crypto').randomBytes(16).toString('hex')

    // Criar pagamento no Mercado Pago
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        transaction_amount: Number(transactionAmount),
        payment_method_id: 'pix',
        description,
        payer
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro Mercado Pago:', data)
      return res.status(response.status).json({ 
        error: 'Erro ao criar pagamento no Mercado Pago',
        details: data
      })
    }

    // Retornar dados do pagamento
    const paymentData = {
      id: data.id,
      status: data.status,
      qr_code: data.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: data.point_of_interaction?.transaction_data?.ticket_url,
      external_reference: data.external_reference,
      created_date: data.date_created
    }

    res.status(200).json(paymentData)

  } catch (error) {
    console.error('Erro interno:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}