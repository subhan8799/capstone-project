// Streaming chat API simulator with sabotage modes
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { message, mode } = req.body || {}
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Empty message' })
  }

  if (mode === 'rate') return res.status(429).json({ error: 'Rate limit exceeded' })

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.writeHead(200)

  const payload = `Assistant reply — echo: ${message}`
  const parts = payload.split(' ')
  const interval = mode === 'slow' ? 700 : 180

  let i = 0
  const send = () => {
    if (i >= parts.length) return res.end('\n')
    res.write(parts[i] + ' ')
    i++

    // mid-stream failure
    if (mode === 'mid' && i === Math.ceil(parts.length / 2)) {
      setTimeout(() => {
        try { res.destroy(new Error('Simulated mid-stream failure')) } catch (e) {}
      }, 120)
      return
    }

    // network failure
    if (mode === 'network' && i === 1) {
      setTimeout(() => { try { res.destroy(new Error('Simulated network failure')) } catch(e){} }, 50)
      return
    }

    setTimeout(send, interval)
  }

  send()
}
