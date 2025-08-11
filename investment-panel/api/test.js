// Endpoint de teste para verificar se o Vercel está funcionando

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  res.status(200).json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  })
}