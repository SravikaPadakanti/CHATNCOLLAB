import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import 'highlight.js/styles/nord.css'
import hljs from 'highlight.js'
import App from './App.jsx'

window.hljs = hljs

createRoot(document.getElementById('root')).render(

  <App />

)
