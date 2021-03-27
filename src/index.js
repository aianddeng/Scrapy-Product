const main = require('./main')
const Target = require('./tasks')
const disconnect = require('./dbHelpers')

;(async () => {
    const targets = Target.loadList().filter(el =>
        ['dsw', 'macys', 'ND', 'zappos'].includes(el.store)
    )

    console.log(targets)

    await main(targets)
})()
