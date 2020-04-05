const https = require('https')

const fetch = (endpoint, method = 'get', params = undefined) => {
    const promise = new Promise((resolve, reject) => {
        let responseStr = ''
        https.get({
            hostname: 'pratoaberto.sme.prefeitura.sp.gov.br',
            path: `/api/${endpoint}`,
            timeout: 15000,
            method,
        }, (res) => {
            res.on('data', (chunk) => {
                responseStr += chunk
            });
            res.on('end', () => {
                const json = JSON.parse(responseStr)
                resolve(json)
            });
        })
    })

    return promise
}


const fetchSchool = (code) => {
    return fetch(`escola/${code}`)

    /*
    nome: string
    tipo_unidade: string
    tipo_atendimento: string
    agrupamento: string|number 
    endereco:string
    bairro:string
    lat:number
    lon:number
    telefone:string
    edital: string
    idades: string[]
    refeicoes: string[]
    data_inicio_vigencia: string
    historico: any[]
    */
}

const fetchMenu = (date, schoolObject) => {
    const { tipo_unidade, tipo_atendimento, agrupamento, nome } = schoolObject
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = (date.getDate() + 1).toString().padStart(2, '0')
    const datestr = `${year}${month}${day}`
    return fetch(`cardapios/${datestr}?tipo_unidade=${encodeURIComponent(tipo_unidade)}&tipo_atendimento=${encodeURIComponent(tipo_atendimento)}&agrupamento=${encodeURIComponent(agrupamento)}&nome=${encodeURIComponent(nome)}`)
}

module.exports = {
    fetchSchool,
    fetchMenu,
}