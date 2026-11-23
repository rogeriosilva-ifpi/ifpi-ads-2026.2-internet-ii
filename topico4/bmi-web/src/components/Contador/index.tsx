import { useEffect, useState } from "react"

export function Contador(){

    const [atual, setAtual] = useState(0)

    useEffect(()=>{
        document.title = `${atual} Cliques`
    }, [atual])

    function handleClick(){
        setAtual(atual + 1)
    }

    return (<button onClick={handleClick}>Clique aqui ({atual})</button>)
}