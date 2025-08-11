// Endpoint para verificar status do pagamento
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387'

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'ID do pagamento não fornecido' })
    }

    // Consultar pagamento no Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro Mercado Pago:', data)
      return res.status(response.status).json({ 
        error: 'Erro ao consultar pagamento',
        details: data
      })
    }

    // Retornar status do pagamento
    const paymentStatus = {
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      external_reference: data.external_reference,
      transaction_amount: data.transaction_amount,
      date_created: data.date_created,
      date_last_updated: data.date_last_updated
    }

    res.status(200).json(paymentStatus)

  } catch (error) {
    console.error('Erro interno:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}