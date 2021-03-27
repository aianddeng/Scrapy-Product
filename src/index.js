const main = require('./main')
const Target = require('./tasks')
const disconnect = require('./dbHelpers')

;(async () => {
    const targets = Target.loadList().filter(el =>
        ['dillards', 'dsw', 'lulus', 'macys', 'ND', 'shein', 'zappos'].includes(
            el.store
        )
    )

    console.log(targets)

    await main(targets)
})()
