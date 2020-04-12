/**
 * A number, or a string containing a number.
 * @typedef {{
 *      nome: string
 *      tipo_unidade: string
 *      tipo_atendimento: string
 *      agrupamento: string|number
 *      endereco:string
 *      bairro:string
 *      lat:number
 *      lon:number
 *      telefone:string
 *      edital: string
 *      idades: string[]
 *      refeicoes: string[]
 *      data_inicio_vigencia: string
 *      historico: any[]
 * }} School
 */

/**
 * @typedef {{
 * 		Desjejum: string[]
 * 		Almoço: string[]
 * 		Lanche: string[]
 * 		Refeição da Tarde: string[]
 * }} MenuEntry
 */

/**
 * @typedef {{
 *      tipo_atendimento:string
 *      tipo_unidade: string
 *      agrupamento: string|number
 *      idade: string
 *      data: string
 *      data_publicacao: string
 *      cardapio: MenuEntry
 * }} Menu
 */

/**
 * @typedef {{
 *		date: string - 20200316
 * 		menu: MenuEntry
 * }} DayEntry
 */

/**
* @typedef {{
*		age: string - 1 ano,
*		days: Array<DayEntry>
*  }} AgesGroup
*/

/**
 * @typedef {{
 *         filename:string,
 *         type:string,
 *         disposition?:'inline'|'attachment',
 *         content:string
 *     }} Attachment
 */