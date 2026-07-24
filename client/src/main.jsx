import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from '@/App.jsx'
import App from './App'
import './index.css'
import { db as base44Client } from './api/base44Client'

// Set the global Base44 DB client for backward compatibility
// Some components still use globalThis.__B44_DB__
globalThis.__B44_DB__ = base44Client;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
