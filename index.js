const api = require('./api')
const exporter = require('./exporter')

const requiredAges = ['2 a 3 anos', '1 ano']
const mealsName = [
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
        const groups = groupByAges(resp, requiredAges)
        groups.forEach((group) => {
            exporter.init()
            exporter.setHeader(group.days.map(day => day.date))

            mealsName.forEach(meal => {
                const row = group.days.map(day => day.menu[meal].join("\n"))
                row.unshift(meal)
                exporter.addRow(row)
            })

            exporter.build(`cardapio-${group.age}.xls`)
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
/*
[
	{
		days:[
			{
                age: '1 ano',
				date: '20200316'
				menu: {
					'Desjejum': [],
					'ALmoco': [],
				}
			},
			{
				date: '20200317'
				menu: {
					'Desjejum': [],
					'ALmoco': [],
				}
			}
		]
	},
	{
        age: '2 a 3 anos',
		days:[
			{
				date: '20200316'
				menu: {
					'Desjejum': [],
					'ALmoco': [],
				}
			},
			{
				date: '20200317'
				menu: {
					'Desjejum': [],
					'ALmoco': [],
				}
			}
		]
	}
]
*/