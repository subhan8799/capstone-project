import React, { useEffect, useRef, useState } from 'react'

function Message({ m, onRetry }) {
  return (
    <div className={`msg ${m.role}`}>
      <div className="meta">{m.role}</div>
      <div className="text">{m.text || (m.streaming ? '…' : '')}</div>
      {m.error && (
        <div className="error-row">
          <span className="err">Error: {m.error}</span>
          <button disabled={m.retrying} onClick={() => onRetry && onRetry(m.id)}>{m.retrying ? 'Retrying…' : 'Retry'}</button>
        </div>
      )}
    </div>
  )
}

let nextId = 1

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('normal')
  const listRef = useRef(null)
  const examples = ['Recommend a sci-fi movie', 'Summarize The Matrix', 'Best movies for rainy day']

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, [messages])

  const sendMessage = async (text, userIdOverride) => {
    if (!text || !text.trim()) return
    const userId = userIdOverride ?? nextId++
    const userMsg = { id: userId, role: 'user', text }
    setMessages((s) => [...s, userMsg])

    const assistantId = nextId++
    const assistantMsg = { id: assistantId, role: 'assistant', text: '', streaming: true }
    setMessages((s) => [...s, assistantMsg])

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ message: text, mode: mode === 'normal' ? undefined : mode }) })
      if (res.status === 429) {
        setMessages((s) => s.map(m => m.id === assistantId ? {...m, streaming:false, error:'Rate limited (429)'} : m))
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(()=>({error:'Unknown'}))
        setMessages((s) => s.map(m => m.id === assistantId ? {...m, streaming:false, error: body.error || 'Server error'} : m))
        return
      }

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: d } = await reader.read()
        if (value) {
          const chunk = dec.decode(value)
          setMessages((s) => s.map(m => m.id === assistantId ? {...m, text: m.text + chunk} : m))
        }
        done = d
      }
      setMessages((s) => s.map(m => m.id === assistantId ? {...m, streaming:false} : m))
    } catch (err) {
      setMessages((s) => s.map(m => m.id === assistantId ? {...m, streaming:false, error: err.message || 'Network error'} : m))
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    sendMessage(input)
    setInput('')
  }

  const handleRetry = (assistantId) => {
    // find previous user message (last user message before this assistant)
    const idx = messages.findIndex(m => m.id === assistantId)
    if (idx === -1) return
    const prior = messages.slice(0, idx).reverse().find(m=>m.role==='user')
    if (!prior) return
    // mark retrying
    setMessages((s) => s.map(m => m.id === assistantId ? {...m, retrying:true, error:undefined} : m))
    // send new assistant message for prior.text
    sendMessage(prior.text)
  }

  return (
    <div className="chat-root">
      <div className="toolbar">
        <label>Dev mode:</label>
        <select value={mode} onChange={(e)=>setMode(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="slow">Slow</option>
          <option value="mid">Mid-stream failure</option>
          <option value="network">Network fail</option>
          <option value="rate">Rate limit (429)</option>
        </select>
      </div>

      <div className="msgs" ref={listRef}>
        {messages.length===0 && (
          <div className="empty">
            <p>No messages yet. Try an example:</p>
            <div className="examples">
              {examples.map(ex=> <button key={ex} onClick={()=>{ setInput(ex); sendMessage(ex) }}>{ex}</button>)}
            </div>
          </div>
        )}
        {messages.map(m => <Message key={m.id} m={m} onRetry={handleRetry} />)}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask the assistant..." />
        <button type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  )
}
