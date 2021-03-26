const Helpers = require('./Helpers')
const disconnect = require('../dbHelpers')
const infoModel = require('../dbHelpers/Info')

;(async () => {
    const fullList = await infoModel.find({})

    await disconnect()

    console.log(`Full collection length: ${fullList.length}`)

    const categories = Array.from(
        new Set(
            fullList.map(el =>
                el.category.slice(0, 30).replace(/(\/|\\|\?|\*|\[|\])/g, '')
            )
        )
    )
    console.log(`Category length: ${categories.length}`)

    const data = {}
    let currentNum = 0

    const joinTask = async category => {
        const tableList = fullList
            .filter(
                el =>
                    true &&
                    el.name &&
                    el.description &&
                    el.path &&
                    el.category &&
                    el.category === category
            )
            .map(el => ({
                name: el.name,
                description: el.description,
                path: Array.from(new Set(el.path)).join('/'),
            }))

        if (tableList && tableList.length) {
            console.log(
                `(${++currentNum}/${categories.length}) ${category}: ${
                    tableList.length
                }`
            )
            data[category] = tableList
        }
    }

    await Promise.all(categories.map(joinTask))

    true &&
        Object.keys(data).length &&
        Object.values(data).length &&
        (await Helpers.writeToExcel(data))
})()
