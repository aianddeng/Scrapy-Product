const basePath = './stores/'
const hanleCollect = [
    {
        origin: ['www.zappos.com'],
        handle: basePath + 'zappos' + '.js',
    },
    {
        origin: ['www.ebay.com'],
        handle: basePath + 'ebay' + '.js',
        usePuppeteer: url =>
            url.match(/^https:\/\/www\.ebay\.com\/(b|sch)\/(.+)/),
    },
    {
        origin: ['www.amazon.com'],
        handle: basePath + 'amazon' + '.js',
        usePuppeteer: url => !url.match(/^https:\/\/www\.amazon\.com\/s\?(.+)/),
    },
    {
        origin: ['www.macys.com'],
        handle: basePath + 'macys' + '.js',
        usePuppeteer: url => false,
    },
]

module.exports = hanleCollect
