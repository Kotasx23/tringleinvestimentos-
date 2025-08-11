import { useState, useEffect } from 'react'
import { CreditCard, QrCode, ExternalLink, Copy, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from './Toast'

const MP_PUBLIC_KEY = 'APP_USR-efc7192b-9dea-43d3-a388-1a8ec43b43f5'

export const PaymentCheckout = ({ amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()
  const { error, success } = useToast()

  const createPayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionAmount: amount,
          description: `Depósito de R$ ${amount.toFixed(2)}`,
          payer: {
            email: user.email,
            first_name: user.user_metadata?.name?.split(' ')[0] || 'Usuário',
            last_name: user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            identification: {
              type: 'CPF',
              number: '12345678909' // Em produção, coletar CPF do usuário
            }
          }
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setPaymentData(data)
      success('Pagamento criado com sucesso!')
    } catch (err) {
      error('Erro ao criar pagamento: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      success('Código PIX copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      error('Erro ao copiar código')
    }
  }

  const checkPaymentStatus = async () => {
    if (!paymentData?.id) return

    try {
      const response = await fetch(`/api/payment_status/${paymentData.id}`)
      const data = await response.json()
      
      if (data.status === 'approved') {
        success('Pagamento aprovado!')
        onSuccess?.(data)
      } else if (data.status === 'rejected') {
        error('Pagamento rejeitado')
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err)
    }
  }

  useEffect(() => {
    if (paymentData?.id) {
      const interval = setInterval(checkPaymentStatus, 5000) // Verificar a cada 5 segundos
      return () => clearInterval(interval)
    }
  }, [paymentData])

  if (paymentData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <QrCode className="w-16 h-16 mx-auto text-primary-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pagamento PIX
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Escaneie o QR Code ou copie o código PIX
          </p>
        </div>

        <div className="space-y-4">
          {/* QR Code */}
          {paymentData.qr_code_base64 && (
            <div className="text-center">
              <img
                src={`data:image/png;base64,${paymentData.qr_code_base64}`}
                alt="QR Code PIX"
                className="mx-auto border border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>
          )}

          {/* Código PIX */}
          {paymentData.qr_code && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código PIX
              </label>
              <div className="flex">
                <textarea
                  readOnly
                  value={paymentData.qr_code}
                  className="flex-1 input-field text-sm font-mono resize-none"
                  rows={3}
                />
                <button
                  onClick={() => copyToClipboard(paymentData.qr_code)}
                  className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Link do pagamento */}
          {paymentData.ticket_url && (
            <div>
              <a
                href={paymentData.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full btn-primary"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir pagamento
              </a>
            </div>
          )}

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
              Aguardando pagamento
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3">
            <button
              onClick={() => setPaymentData(null)}
              className="flex-1 btn-secondary"
            >
              Novo pagamento
            </button>
            <button
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <CreditCard className="w-16 h-16 mx-auto text-primary-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pagamento PIX
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          R$ {amount.toFixed(2)}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Clique no botão abaixo para gerar o pagamento PIX. Você poderá pagar escaneando o QR Code ou copiando o código PIX.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={createPayment}
            disabled={loading}
            className="flex-1 btn-primary"
          >
            {loading ? 'Gerando...' : 'Gerar PIX'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}