const express = require('express')
const app = express()
app.use(express.json())
const uuid = require('uuid')


let funcionarios = [
    { id: uuid.v4(), nome: 'jose', funcao: 'Analista de Sistemas', departamento: 'TI', email: 'jose@ti.com', telefone: '2499999999'},
    { id: uuid.v4(), nome: 'maria', funcao: 'Marketing', departamento: 'Marketing', email: 'maria@mkt.com', telefone: '24977777777'},
    { id: uuid.v4(), nome: 'joao', funcao: 'Professor', departamento: 'Educacional', email: 'joao@ead.com', telefone: '24955555555'},
]


// VALIDAÇÕES (middleware)

const CheckId = (request, response, next) => {
    const { id } = request.params
    const dados = funcionarios.find(func => func.id === id)
    if(!dados){
        return response
                .status(400)
                .json({ error: 'Id Inexistente' })
    }

    return next()    
}

const CheckCadFuncionario = (request, response, next) => {
    const { nome, funcao, departamento, email, telefone } = request.body

    if(!nome || !funcao || !departamento || !email || !telefone){
        return response
                .status(400)
                .json({ error: 'Favor Preencher todos os campos:(nome,função,departamento,email ou telefone)' })
    }    
    return next()
}




// ROUTES

//LISTAR FUNCIONARIOS
app.get('/funcionarios', (request, response) => {
    return response
            .status(200)
            .json(funcionarios)
})

//BUSCAR FUNCIONARIO POR ID
app.get('/funcionarios/:id', CheckId, (request, response) => {
    const { id } = request.params    
    const dados = funcionarios.find(func => func.id === id)
    return response
            .status(200)
            .json(dados)
})

//CADASTRAR FUNCIONARIO
app.post('/funcionarios', CheckCadFuncionario, (request, response) => {
    const { nome, funcao, departamento, email, telefone } = request.body
    const dadosFuncionario = {
        id: `${uuid.v4()}`,
        nome,
        funcao,
        departamento,
        email,
        telefone
    }

    funcionarios = [...funcionarios, dadosFuncionario]   
    return response
            .status(200)
            .json(dadosFuncionario)
})

//ALTERAR DADOS DO FUNCIONARIO
app.put('/funcionarios/:id', CheckId, CheckCadFuncionario, (request, response) =>{
    const { nome, funcao, departamento, email, telefone } = request.body
    const { id } = request.params 
    let indice = funcionarios.findIndex(funcionario => funcionario.id === id)
    const dadosFuncionario = {
        id,
        nome,
        funcao,
        departamento,
        email,
        telefone
    }

    funcionarios.splice(indice, 1, dadosFuncionario)
    return response
            .status(200)
            .json(dadosFuncionario)
})

//DELETAR O FUNCIONARIO
app.delete('/funcionarios/:id', CheckId, (request, response) => {
    const { id } = request.params
    funcionarios.splice(id, 1)
    return response
            .status(200)
            .json(funcionarios)
})


app.listen(3333, () => {
    console.log('Server Up')
})
