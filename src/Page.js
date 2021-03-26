const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require('cheerio')
const useProxy = require('puppeteer-page-proxy')
const fs = require('fs')

const METHOD = require('./action')
const { proxy, tunnelProxy, urlProxy } = require('./config/local.base')

class Page {
    static browser = null
    static browser_status = null

    // save html file to logger folder.
    static save_to_file(name, html) {
        fs.writeFile(`./logger/${name}.html`, html, error => {
            error && console.error(error)
        })
    }

    // use cherrio parse the axios/puppeteer html file.
    static parse_to_jquery(html) {
        return cheerio.load(html)
    }

    // just use request catch code.
    static async cherrio_load(url) {
        try {
            const { data } = await axios.get(
                url,
                Object.assign(
                    {},
                    {
                        headers: {
                            'user-agent':
                                'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45',
                        },
                        maxRedirects: 0,
                        timeout: 60 * 1000,
                    },
                    url.startsWith('https')
                        ? {
                              httpsAgent: tunnelProxy,
                          }
                        : {
                              proxy,
                          }
                )
            )

            return data
        } catch (e) {
            console.error(
                `Error: ${e.code || (e.response && e.response.statusText)}`
            )

            if (e.response && e.response.statusText === 'Too Many Requests') {
                return 429
            } else {
                return 404
            }
        }
    }

    // use fake browser to load data.
    static async puppeteer_load(url) {
        if (!Page.browser && !Page.browser_status) {
            Page.browser_status = 'loading'
            Page.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-infobar',
                    '--disable-web-security',
                    '--ignore-certificate-errors',
                ],
                ignoreHTTPSErrors: true,
            })
            Page.browser_status = 'loaded'
        }

        await new Promise(resolve =>
            setInterval(() => Page.browser && resolve(true), 1000)
        )

        let page = null
        try {
            page = await Page.browser.newPage()
            await page.setUserAgent(
                '"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36 Edg/89.0.774.45"'
            )
            // await useProxy(page, urlProxy.url);
            await page.goto(url, {
                timeout: 60 * 1000,
                waitUntil: 'domcontentloaded',
            })
        } catch (e) {
            console.error(`Error: ${e.code}`)
            return 429
        }

        const data = await page.content()
        await page.close()

        return data
    }

    // 入口方法
    static run = methodType => async url => {
        console.log('Start scrapy: ', url)

        let html = null
        switch (methodType) {
            case METHOD.AXIOS:
                html = await Page.cherrio_load(url)
                break
            case METHOD.PUPPETEER:
                html = await Page.puppeteer_load(url)
                break
            default:
                html = ''
                break
        }

        // Page.save_to_file(url.split('/').pop(), html);

        return typeof html === 'number' ? html : Page.parse_to_jquery(html)
    }
}

module.exports = Page
