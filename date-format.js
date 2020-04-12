/**
 * 
 * @param {Date} date 
 * @returns {string} - YYYY-MM-DD
 */
const iso8601 = (date, separator = '-') => {
	const { year, month, day } = getDateInfo(date)
	return `${year}${separator}${month}${separator}${day}`
}

/**
 * 
 * @param {Date} date 
 * @returns {string} - YYYYMMDD
 */
const toApi = (date) => {
	return iso8601(date, '')
}

/**
 * 
 * @param {Date} date 
 * @returns {string} - YYYYMMDD
 */
const br = (date) => {
	const { year, month, day } = getDateInfo(date)
	return `${day}/${month}/${year}`
}

/**
 * 
 * @param {string} datestr 
 * @returns {Date}
 */
const fromApi = (datestr) => {
	if (datestr.length === 8) {
		const dateiso = datestr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
		const date = new Date(dateiso)
		return date
	}
}

const getDateInfo = (date) => {
	return {
		year: date.getFullYear(),
		month: (date.getUTCMonth() + 1).toString().padStart(2, '0'),
		day: (date.getUTCDate()).toString().padStart(2, '0'),
	}
}

module.exports = {
	iso8601,
	toApi,
	fromApi,
	br,
}