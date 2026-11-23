import { useState } from 'react'
import './App.css'
import { Contador } from './components/Contador'

function App() {

  const [peso, setPeso] = useState(0.0)
  const [altura, setAltura] = useState(0)
  const [bmi, setBmi] = useState<number>(0)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const bmiValue = peso/(altura*altura)
    setBmi(bmiValue)
  }

  const handleOnChangePeso = (e) => {
    const valor = parseFloat(e.target.value)
    setPeso(valor)
  }

  const handleClear = () => {
    setPeso(0)
    setAltura(0)
    setBmi(0)
  }

  return (
    <>
      <header>
        <h1>BMI Calculator</h1>
      </header>
      <main>
        <h2>Forneça dos Dados</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="peso">Peso:</label>
          <input type="number"
            name="peso"
            value={peso}
            onChange={handleOnChangePeso}
            placeholder="ex.: 97.5"/>
          
          <label htmlFor="altura">Altura:</label>
          <input type="number"
            name="altura"
            placeholder="ex.: 1.70"
            value={altura}
            onChange={(e)=>setAltura(parseFloat(e.target.value))}
            />

          <input type="submit" value="Calcular"/>
          <button onClick={handleClear}>Limpar</button>
        </form>

        <div>
          <h2>Resultado:</h2>
          {bmi > 0 && 
            <p>
              <strong>Seu IMC é </strong>{bmi.toFixed(2)}
            </p>
          }
        </div>
        <Contador />
      </main>
      <footer>2026 - IFPI ADS</footer>
    </>
  )
}

export default App
