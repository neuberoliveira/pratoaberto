const api = require('./api')

api.fetchSchool(309199).then(school => {
    api.fetchMenu(calcMenuDate(), school).then(resp => {
        console.log(resp)
    })
})





function calcMenuDate() {
    date = new Date()
    let weekday = date.getDay()
    if (weekday >= 1 && weekday <= 5) {
        const subDays = weekday - 1 //-1 is to prune calculation to get always the monday of the current week
        date.setDate(date.getDate() - subDays)
    } else if (weekday == 6) {
        date.setDate(date.getDate() + 6)
    } else if (weekday == 0) {
        date.setDate(date.getDate() + 1)
    }

    return date
}