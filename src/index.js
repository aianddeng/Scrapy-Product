const main = require('./main')
const Target = require('./tasks')
const disconnect = require('./dbHelpers')

;(async () => {
    const targets = Target.loadList().filter(el =>
        [
            'dillards',
            'dsw',
            'lulus',
            'macys',
            'ND',
            'shein',
            'zappos',
            'tb',
            'saks',
            'uniqlo',
            'coach',
            'kipling',
            'f21',
            'asos',
        ].includes(el.store)
    )

    await main(targets)
})()
