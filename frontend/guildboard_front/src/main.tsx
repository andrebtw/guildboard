import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Adventurers from './Adventurers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Adventurers />
    
  </StrictMode>,
)
