import { useState } from "react"

interface WelcomeProps{
    name: string
}

export function Welcome(props:WelcomeProps){

    const [like, setLike] = useState<number>(0)

    const handleOnClick = () => {
        setLike(like + 1)
    }

    return <div>
            <h1>Olá {props.name}, seja bem-vindo!</h1>
            <h2>As Preferências de {[props.name]}</h2>
            <ul>
                <li>Café Cubano</li>
                <li>Bolo Bacuri Koreano</li>
                <li>Futebol Suíço</li>
            </ul>
            <button onClick={handleOnClick}>Like ({like})</button>
        </div>
}