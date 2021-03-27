const basePath = './stores/'
const hanleCollect = [
    {
        origin: ['www.zappos.com'],
        handle: basePath + 'zappos' + '.js',
        usePuppeteer: () => false,
        useProxy: () => false,
    },
    {
        origin: ['www.ebay.com'],
        handle: basePath + 'ebay' + '.js',
        usePuppeteer: url =>
            url.match(/^https:\/\/www\.ebay\.com\/(b|sch)\/(.+)/),
        useProxy: () => false,
    },
    {
        origin: ['www.amazon.com'],
        handle: basePath + 'amazon' + '.js',
        usePuppeteer: url => !url.match(/^https:\/\/www\.amazon\.com\/s\?(.+)/),
        useProxy: () => false,
    },
    {
        origin: ['www.macys.com'],
        handle: basePath + 'macys' + '.js',
        usePuppeteer: () => false,
        useProxy: () => true,
    },
    {
        origin: ['www.dsw.com'],
        handle: basePath + 'dsw' + '.js',
        usePuppeteer: () => true,
        useProxy: () => false,
    },
    {
        origin: ['www.nordstromrack.com'],
        handle: basePath + 'nd' + '.js',
        usePuppeteer: url => !url.match(/https:\/\/www.nordstromrack.com\/s\//),
        useProxy: () => true,
    },
    {
        origin: ['www.nordstrom.com'],
        handle: basePath + 'nd2' + '.js',
        usePuppeteer: url => !url.match(/https:\/\/www.nordstrom.com\/s\//),
        useProxy: () => true,
    },
    {
        origin: ['us.shein.com', 'www.shein.com'],
        handle: basePath + 'shein' + '.js',
        usePuppeteer: () => true,
        useProxy: () => false,
    },
    {
        origin: ['www.dillards.com'],
        handle: basePath + 'dillards' + '.js',
        usePuppeteer: () => false,
        useProxy: () => false,
    },
    {
        origin: ['www.lulus.com'],
        handle: basePath + 'lulus' + '.js',
        usePuppeteer: url => !url.match(/https:\/\/www.lulus.com\/products\//),
        useProxy: () => true,
    },
]

module.exports = hanleCollect
