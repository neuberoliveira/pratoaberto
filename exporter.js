const fs = require('fs');

let header = []
let data = []

const init = () => {
	header = []
	data = []
}
const setHeader = (h) => header = h
const setData = (d) => data = d
const addRow = (row) => data.push(row)

const build = (filename) => {
	// console.log(header)
	// console.log(data)

	const headertr = buildHeader()
	const rowsstr = buildContent()
	const template = fs.readFileSync('table-template.txt', { encoding: 'utf8' }).toString()

	const content = template.replace('{header}', headertr).replace('{rows}', rowsstr)

	fs.writeFileSync(`./${filename}`, content, { encoding: 'utf8' })
	return content
}

const buildHeader = () => {
	return `<td></td>\n${header.map(cel => `<td>${cel}</td>`).join("\n")}`
}

const buildContent = () => {
	return data.map(row => `
		<tr>
			${row.map(cel => `<td>${cel}</td>`).join("\n")}
		</tr>`).join("\n")
}
module.exports = {
	init,
	build,
	setHeader,
	setData,
	addRow,
}