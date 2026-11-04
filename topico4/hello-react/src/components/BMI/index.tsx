import { useState } from "react"

export const BMI = () => {

    const [peso, setPeso] = useState(100.0)

    const handleOnSubmit = (event) => {
        event.preventDefault()
        alert(peso)
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <input type="number" placeholder="Peso (kg)" value={peso} />
            <input type="number" placeholder="Altura (m)"/>
            <input type="submit" value="Calcular" />
        </form>
    )
}