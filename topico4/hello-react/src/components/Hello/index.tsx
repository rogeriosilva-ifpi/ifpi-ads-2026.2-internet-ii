interface HelloProps{
    nome:string,
    clube?: string
}

export function Hello({nome, clube = 'Grêmio'}: HelloProps){
    return <h1>{nome} - Clube: {clube}</h1>
}