const api = require('./api')
const requiredAges = ['2 a 3 anos', '1 ano']
const requiredAges = ['2 a 3 anos', '1 ano']
const meals = [
    'Desjejum',
    'Colação',
    'Almoço',
    'Lanche',
    'Refeição da Tarde',
]

api.fetchSchool(309199).then(school => {
    // const startDate = calcMenuDate()
    const startDate = new Date('2020-03-16 10:00:00')
    api.fetchMenuWeek(startDate, school).then(resp => {
        const mealsGroup = api.groupWeeks(resp, requiredAges)
        Object.keys(mealsGroup).forEach(key => {
            const group = mealsGroup[key]

        })
    })
})

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