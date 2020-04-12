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

const build = () => {
	// console.log(header)
	// console.log(data)

	const headertr = buildHeader()
	const rowsstr = buildContent()
	const template = fs.readFileSync('table-template.txt', { encoding: 'utf8' }).toString()

	const content = template.replace('{header}', headertr).replace('{rows}', rowsstr)

	return content
}

const save = (filename, content) => fs.writeFileSync(`./${filename}`, content, { encoding: 'utf8' })

const buildHeader = () => {
	return `<td></td>\n${header.map(cel => `<td align="left" valign="top" style="font-size: 14pt; font-weight:bold;">${cel}</td>`).join("\n")}`
}

const buildContent = () => {
	return data.map(row => `
		<tr>
			${row.map(cel => `<td align="left" valign="top" style="font-size: 12pt;">${cel}</td>`).join("\n")}
		</tr>`).join("\n")
}
module.exports = {
	init,
	build,
	save,
	setHeader,
	setData,
	addRow,
}