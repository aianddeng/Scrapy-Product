const xlsx = require('node-xlsx');

class Target {
    static loadList() {
        const table = xlsx.parse('./src/tasks/categories-store-links.xlsx');
        const sheetData = table.find(el => el.name === 'Sheet2').data.slice(1);
        const store = sheetData.filter(el => el.length >= 5);
        return store.map(el => ({
            'category': el[2],
            'store': el[3],
            'url': el[4],
        }))
    }
}

// const list = Target.loadList().filter(el=>el.store==='ebay');
// console.log(list);

module.exports = Target;