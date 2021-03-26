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
]

module.exports = hanleCollect
