require('./typedefs')
const https = require('https')
const http = require('http')
const url = require('url')
const dateFormat = require('./date-format')

const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const PRATOABERTO_BASE_URL = 'https://pratoaberto.sme.prefeitura.sp.gov.br/api'
const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3'
const defaultOptions = { method: 'get', timeout: 15000 }

const fetch = (endpoint, options = {}, body = undefined) => {
    const parseQueryString = false
    const urlparsed = url.parse(endpoint, parseQueryString)
    const protocolFunc = urlparsed.protocol === 'https:' ? https : http


    const hostname = urlparsed.hostname
    const path = urlparsed.path
    const requestOptions = {
        ...defaultOptions,
        ...options,
        hostname,
        path,
    }

    // console.log(requestOptions, body, `${options.method} ${urlparsed.href}`)
    const promise = new Promise((resolve, reject) => {
        let responseStr = undefined
        const req = protocolFunc.request(requestOptions, (res) => {
            res.on('data', (chunk) => {
                if (!responseStr) {
                    responseStr = ''
                }
                responseStr += chunk
            });
            res.on('end', () => {
                try {
                    if (responseStr) {
                        const json = JSON.parse(responseStr)
                        resolve(json)
                    }
                    resolve()
                } catch (ex) {
                    console.log('EXCEPTION', responseStr, ex)
                    reject(ex)
                }
            });
            res.on('error', (ex) => {
                console.log('ERROR', responseStr, ex)
                reject(ex)
            })
        })
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end()
    })

    return promise
}

/**
 * @param {{subject:string, body:string}} mailConfig
 * @param {Array<Attachment>} attachments
 * @returns {*}
 */
const sendMail = (mailConfig, attachments) => {
    const key = process.env.SENDGRID_KEY
    const sendgridParams = {
        subject: mailConfig.subject,
        from: {
            email: process.env.SENDGRID_SENDER_ADDRESS,
            name: process.env.SENDGRID_SENDER_NAME,
        },
        personalizations: [
            {
                to: [
                    {
                        "email": process.env.RECEIVER_ADDRESS,
                        "name": process.env.RECEIVER_NAME,
                    }
                ],
            }
        ],
        content: [{
            type: 'text/plain',
            value: mailConfig.body
        }],
        attachments,
    }

    return fetch(`${SENDGRID_BASE_URL}/mail/send`, {
        method: METHOD_POST,
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        }
    }, sendgridParams)
}

/**
 * 
 * @param {number|string} code 
 * @returns {School}
 */
const fetchSchool = (code) => {
    return fetch(`${PRATOABERTO_BASE_URL}/escola/${code}`)
}

/**
 * 
 * @param {Date} date 
 * @param {School} schoolObject 
 * 
 * @returns {Promise<Menu>}
 */
const fetchMenu = (date, schoolObject) => {
    const { tipo_unidade, tipo_atendimento, agrupamento, nome } = schoolObject
    const datestr = dateFormat.toApi(date)
    return fetch(`${PRATOABERTO_BASE_URL}/cardapios/${datestr}?tipo_unidade=${encodeURIComponent(tipo_unidade)}&tipo_atendimento=${encodeURIComponent(tipo_atendimento)}&agrupamento=${encodeURIComponent(agrupamento)}&nome=${encodeURIComponent(nome)}`)
}

/**
 * 
 * @param {Date} date 
 * @param {School} schoolObject 
 * @returns {Promise<Menu[]>}
 */
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

module.exports = {
    fetchSchool,
    fetchMenu,
    fetchMenuWeek,
    sendMail,
}