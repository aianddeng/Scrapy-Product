const fs = require('fs')
const path = require('path')
const xlsx = require('node-xlsx')

const Helpers = require('./Helpers')
const disconnect = require('../dbHelpers')
const infoModel = require('../dbHelpers/Info')

class Target {
    static sheetDataMap = null

    static loadList() {
        if (!Target.sheetDataMap) {
            const table = xlsx.parse('./src/tasks/categories-store-links.xlsx')
            const sheetData = table
                .find(el => el.name === 'Sheet2')
                .data.slice(1)

            let category_1 = null
            let category_2 = null
            const sheetDataMap = sheetData
                .slice()
                .map(el => {
                    if (el.length === 1) {
                        category_1 = el[0]
                    } else if (el.length - el.filter(Boolean).length === 1) {
                        category_2 = el[1]
                        el[0] = category_1
                    } else if (el.length - el.filter(Boolean).length === 2) {
                        el[0] = category_1
                        el[1] = category_2
                    }
                    return el
                })
                .filter(el => el.length === 5)
                .map(el => el.slice(0, 3))

            Target.sheetDataMap = sheetDataMap
        }

        return Target.sheetDataMap
    }

    static category1() {
        const category = [...new Set(Target.loadList().map(el => el[0]))]
        return category
    }

    static category2(cat) {
        const category = [
            ...new Set(
                Target.loadList()
                    .filter(el => el[0] === cat)
                    .map(el => el[1])
            ),
        ]
        return category
    }

    static category3() {
        const category = [...new Set(Target.loadList().map(el => el[2]))]
        return category
    }

    static mkdir_category() {
        const baseUrl = path.join(__dirname, 'Category')

        fs.access(baseUrl, err => {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(baseUrl, err => {
                    err && console.error(err)
                })
            }
        })

        for (const cat of Target.category1()) {
            const path1 = path.join(baseUrl, cat)

            fs.access(path1, err => {
                if (err && err.code === 'ENOENT') {
                    fs.mkdir(path1, err => {
                        err && console.error(err)
                    })
                }
            })

            for (const cat2 of Target.category2(cat)) {
                const path2 = path.join(path1, cat2)
                fs.access(path2, err => {
                    if (err && err.code === 'ENOENT') {
                        fs.mkdir(path2, err => {
                            console.log(path2)
                            err && console.error(err)
                        })
                    }
                })
            }
        }
    }

    static async single_xlsx() {}

    static async write_xlsx() {
        // Collect data from mongodb.
        const fullList = await infoModel.find({})
        await disconnect()
        console.log(`Full collection length: ${fullList.length}`)

        const categories = Array.from(
            new Set(fullList.map(el => el.category))
        ).map(el => ({
            catFull: el,
            category: el.slice(0, 30).replace(/(\/|\\|\?|\*|\[|\])/g, ''),
        }))
        console.log(`Category length: ${categories.length}`)

        let currentNum = 0
        for (const categoryElem of categories) {
            const data = {}

            const tableList = fullList
                .filter(
                    el =>
                        true &&
                        el.name &&
                        el.description &&
                        el.path &&
                        el.category &&
                        el.category === categoryElem.catFull
                )
                .map(el => ({
                    name: el.name,
                    description: el.description,
                    path: Array.from(new Set(el.path)).join('/'),
                }))

            if (tableList && tableList.length) {
                console.log(
                    `(${++currentNum}/${categories.length}) ${
                        categoryElem.catFull
                    }: ${tableList.length}`
                )
                data[categoryElem.category] = tableList
            } else {
                console.log(
                    `(${++currentNum}/${categories.length}) ${
                        categoryElem.catFull
                    }: error`
                )
            }

            const paths = Target.loadList().find(
                el => el[2] === categoryElem.catFull
            )
            const filePath = path.join(
                __dirname,
                'Category',
                paths[0],
                paths[1],
                paths[2].replace(/(\/)/g, '-') + '.xlsx'
            )
            console.log(filePath)

            true &&
                Object.keys(data).length &&
                Object.values(data).length &&
                (await Helpers.writeToExcel(data, filePath))
        }
    }
}

;(async () => {
    Target.mkdir_category()
    console.log('Create category dir done.')

    await Target.write_xlsx()

    console.log('done')
})()
