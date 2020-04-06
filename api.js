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
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = (date.getDate()).toString().padStart(2, '0')
    return `${year}${month}${day}`
}

const fetchMenu = (date, schoolObject) => {
    const { tipo_unidade, tipo_atendimento, agrupamento, nome } = schoolObject
    const datestr = formatDate(date)
    return fetch(`cardapios/${datestr}?tipo_unidade=${encodeURIComponent(tipo_unidade)}&tipo_atendimento=${encodeURIComponent(tipo_atendimento)}&agrupamento=${encodeURIComponent(agrupamento)}&nome=${encodeURIComponent(nome)}`)

    /* 
    tipo_atendimento:string
    tipo_unidade: string
    agrupamento: string|number
    idade: string
    data: string
    data_publicacao: string
    cardapio: {
        Desjejum: string[]
        Almoço: string[]
        Lanche: string[]
        Refeição da Tarde: string[]
    }
    */
}

const fetchMenuWeek = (date, schoolObject) => {
    return new Promise((resolve, reject) => {
        const promises = []
        const result = {}
        Array(5).fill(0).forEach(_ => {
            promises.push(fetchMenu(date, schoolObject))

            date.setDate(date.getDate() + 1)
        })

        Promise.all(promises).then((results) => {
            resolve(results)
        })
    })
}

const groupWeeks = (results, ages) => {
    const resp = {}
    results.forEach(menuResp => menuResp.filter((item) => ages.indexOf(item.idade) !== -1).forEach(row => {
        if (!resp[row.data]) {
            resp[row.data] = {}
        }

        resp[row.data][row.idade] = row.cardapio
    }))

    return resp
}

module.exports = {
    fetchSchool,
    fetchMenu,
    fetchMenuWeek,
    groupWeeks,
}