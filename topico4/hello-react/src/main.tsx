import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { Hello } from './Hello.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Hello nome='Rogério da Silva' />
    <Hello nome='Kamila' />
    <Hello nome='Milena' clube='Flamengo'/>  */}
  </StrictMode>,
)
