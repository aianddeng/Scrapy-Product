const disconnect = require('../dbHelpers')
const taskModel = require('../dbHelpers/Task')
const infoModel = require('../dbHelpers/Info')

;(async () => {
    const fullInfoListLength = await infoModel.find({})
    console.log(
        `Full products info collection length: ${fullInfoListLength.length}`
    )

    const infoListCategories = Array.from(
        new Set(fullInfoListLength.map(el => el.category))
    )
    console.log(`Category length: ${infoListCategories.length}`)

    for (const category of infoListCategories) {
        console.log(category)

        const categoryLenth = fullInfoListLength.filter(
            el => el.category === category
        ).length

        if (categoryLenth < 1000) {
            console.log('Length: ', categoryLenth)
            await taskModel.updateMany(
                {
                    $or: [
                        {
                            type: 0,
                        },
                        {
                            type: -1,
                        },
                    ],
                    category,
                },
                {
                    status: 'waiting',
                    type: 0,
                }
            )
        }
    }

    disconnect()
})()
