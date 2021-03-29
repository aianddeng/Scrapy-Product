const tunnel = require('tunnel')
// const proxyChain = require('proxy-chain');
// const newproxyUrl = await proxyChain.anonymizeProxy(urlProxy.url);;
// `--proxy-server=${newproxyUrl}`

const proxy = {
    host: 'proxy-server.scraperapi.com',
    port: '8001',
    auth: {
        username: 'scraperapi.country_code=us',
        password: '187d1f8d2644e4d26d42aa2f6db1ff11',
    },
}

const tunnelProxy = tunnel.httpsOverHttp({
    proxy: {
        host: 'proxy-server.scraperapi.com',
        port: '8001',
        proxyAuth:
            'scraperapi.country_code=us:187d1f8d2644e4d26d42aa2f6db1ff11',
    },
    rejectUnauthorized: false,
})

const urlProxy = {
    url:
        'http://scraperapi.country_code=us:187d1f8d2644e4d26d42aa2f6db1ff11@proxy-server.scraperapi.com:8001',
}

const browserConfig = {
    headless: process.env.NODE_ENV === 'production' ? true : false,
}

const taskConfig = {
    timer: 1 * 1000,
    concurrency: 5,
    puppeteer_length: 5,
}

module.exports = {
    proxy,
    tunnelProxy,
    urlProxy,
    browserConfig,
    taskConfig,
}
