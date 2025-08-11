// Webhook para receber notificações do Mercado Pago
// Configure no painel do Mercado Pago: https://<your-app>/api/webhook_mercadopago

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
    const { data } = req.body

    if (!data || !data.id) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    // Consultar pagamento no Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('Erro ao consultar pagamento:', payment)
      return res.status(500).json({ error: 'Erro ao processar webhook' })
    }

    // Processar pagamento baseado no status
    switch (payment.status) {
      case 'approved':
        await handleApprovedPayment(payment)
        break
      case 'rejected':
        await handleRejectedPayment(payment)
        break
      case 'pending':
        await handlePendingPayment(payment)
        break
      default:
        console.log(`Status não processado: ${payment.status}`)
    }

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('Erro no webhook:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleApprovedPayment(payment) {
  try {
    // Aqui você deve integrar com seu banco de dados (Supabase)
    // Exemplo de atualização no Supabase:
    
    // 1. Atualizar status do pagamento
    // await supabase
    //   .from('payments')
    //   .update({ 
    //     status: 'approved',
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('mp_payment_id', payment.id)

    // 2. Adicionar saldo ao usuário
    // await supabase
    //   .from('users')
    //   .update({ 
    //     balance: supabase.raw(`balance + ${payment.transaction_amount}`)
    //   })
    //   .eq('id', payment.external_reference)

    // 3. Registrar transação
    // await supabase
    //   .from('transactions')
    //   .insert({
    //     user_id: payment.external_reference,
    //     type: 'deposit',
    //     amount: payment.transaction_amount,
    //     description: `Depósito via PIX - Pagamento ${payment.id}`,
    //     status: 'completed'
    //   })

    console.log(`Pagamento aprovado: ${payment.id}`)
  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error)
  }
}

async function handleRejectedPayment(payment) {
  try {
    // Atualizar status do pagamento para rejeitado
    // await supabase
    //   .from('payments')
    //   .update({ 
    //     status: 'rejected',
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('mp_payment_id', payment.id)

    console.log(`Pagamento rejeitado: ${payment.id}`)
  } catch (error) {
    console.error('Erro ao processar pagamento rejeitado:', error)
  }
}

async function handlePendingPayment(payment) {
  try {
    // Atualizar status do pagamento para pendente
    // await supabase
    //   .from('payments')
    //   .update({ 
    //     status: 'pending',
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('mp_payment_id', payment.id)

    console.log(`Pagamento pendente: ${payment.id}`)
  } catch (error) {
    console.error('Erro ao processar pagamento pendente:', error)
  }
}