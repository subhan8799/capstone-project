import React from 'react'

export default function ErrorPage({ statusCode }) {
  return (
    <div style={{padding:20,fontFamily:'system-ui,Segoe UI,Roboto'}}>
      <h1>Something went wrong</h1>
      <p>We encountered an unexpected error.</p>
      <button onClick={() => location.reload()}>Reload</button>
    </div>
  )
}
