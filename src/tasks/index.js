const xlsx = require('node-xlsx')

class Target {
    static loadList() {
        const table = xlsx.parse('./src/tasks/categories-tasks.xlsx')
        const sheetData = table.find(el => el.name === 'Sheet2').data.slice(1)
        const store = sheetData.filter(el => el.length >= 5)
        return store.map(el => ({
            category: el[2],
            store: el[3],
            url: el[4],
        }))
    }
}

module.exports = Target
