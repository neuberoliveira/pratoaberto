require('./typedefs')
const api = require('./api')
const exporter = require('./exporter')
const dateFormat = require('./date-format')

const requiredAges = ['2 a 3 anos', '1 ano']
const mealsName = [
    'Desjejum',
    'Colação',
    'Almoço',
    'Lanche',
    'Refeição da Tarde',
]

api.fetchSchool(process.env.SCHOOL_CODE).then(school => {
    // const initDate = calcMenuDate()
    const initDate = new Date('2020-03-16 10:00:00')
    const startDate = new Date(initDate)
    const endDate = new Date(initDate)
    endDate.setDate(endDate.getDate() + 5)

    api.fetchMenuWeek(initDate, school).then(resp => {
        const groups = groupByAges(resp, requiredAges)
        const attachments = [];

        groups.forEach((group) => {
            exporter.init()
            exporter.setHeader(group.days.map(day => dateFormat.br(dateFormat.fromApi(day.date))))

            mealsName.forEach(meal => {
                const row = group.days.map(day => day.menu[meal].join("<br />"))
                row.unshift(meal)
                exporter.addRow(row)
            })


            attachments.push({
                filename: `Cardapio ${group.age}.xls`,
                type: 'application/vnd.ms-excel',
                disposition: 'attachment',
                content: Buffer.from(exporter.build()).toString('base64'),
            })
            // exporter.save(`cardapio-${group.age}.xls`, exporter.build())
        })
        const config = {
            subject: 'Cardapio semanal - Prato Aberto',
            body: `Cardapio do periodo de ${dateFormat.br(startDate)} ate ${dateFormat.br(endDate)}`,
        }
        api.sendMail(config, attachments).catch(err => console.log('Ops!', err)).then(resp => console.log('Mail sent', resp))
    })
})







/**
 * Points date to the monday
 * If Mon to Fri set to last/current Monday
 * If Sat or Sun set to next Monday
 * 
 * @returns Date
 */
function calcMenuDate() {
    date = new Date()
    let weekday = date.getDay()
    if (weekday >= 1 && weekday <= 5) {// monday to friday
        const subDays = weekday - 1 //-1 is to prune calculation to get always the monday of the current week
        date.setDate(date.getDate() - subDays)
    } else if (weekday == 6) {// saturday
        date.setDate(date.getDate() + 2)
    } else if (weekday == 0) {// sunday
        date.setDate(date.getDate() + 1)
    }

    return date
}

/**
 * @param {Array<Menu>} results
 * @param {Array<string>} ages
 * @returns {Array<AgesGroup>}
 */
function groupByAges(results, ages) {
    const resp = []
    results.forEach((menuResp, menuRespIndex) => menuResp.filter((item) => ages.indexOf(item.idade) !== -1).forEach((row, rowIndex) => {
        const idx = rowIndex
        if (!resp[idx]) {
            resp[idx] = {
                age: '',
                days: [],
            }
        }

        const entry = resp[idx]
        entry.age = row.idade
        entry.days.push({
            date: row.data,
            menu: row.cardapio
        })
    }))

    return resp
}