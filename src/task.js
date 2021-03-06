const Page = require('./Page')
const METHOD = require('./action')
const hanleStore = require('./stores')

const task = ({ url, category }) => async ({ taskModel, infoModel }) => {
    // 分类足够，自动退出
    const cat = await infoModel.find({
        category,
    })

    if (cat.length >= 1000) {
        await taskModel.updateMany(
            {
                $or: [
                    {
                        status: 'waiting',
                    },
                    {
                        status: 'doing',
                    },
                    {
                        status: 'error',
                    },
                ],
                category,
            },
            {
                status: 'oversize',
                type: -1,
            }
        )

        console.log('Oversize the request: ' + url)
        console.log({
            category,
            length: cat.length,
        })

        return
    }

    // 如果没有mappings则直接退出
    const hostname = new URL(url).hostname

    const handleTarget = hanleStore.find(el => el.origin.includes(hostname))

    if (!handleTarget) {
        await taskModel.updateOne(
            {
                url,
            },
            {
                status: 'error',
                type: -1,
            },
            {
                upsert: true,
            }
        )
        return
    }

    // 选择方法
    const method = handleTarget.usePuppeteer(url)
        ? METHOD.PUPPETEER
        : METHOD.AXIOS

    const isProxyPage = handleTarget.useProxy(url)

    const $ = await Page.run(method)(isProxyPage)(url)

    if (typeof $ === 'number') {
        if ($ === 429) {
            await taskModel.updateOne(
                {
                    url,
                },
                {
                    status: 'waiting',
                }
            )
        } else if ($ === 404) {
            await taskModel.updateOne(
                {
                    url,
                },
                {
                    status: 'error',
                    type: -1,
                }
            )
        }

        return
    }

    const handle = require(handleTarget.handle)

    const { error, outOfStock, product_info, product_links } = handle($, url)

    const filterTaskTarget = async url => {
        const oldDocument = await taskModel.findOne({
            url,
        })

        return oldDocument ? '' : url
    }

    const checkInfoTarget = async target => {
        const oldDocument = await infoModel.findOne({
            url: target.url,
        })

        if (oldDocument) return

        try {
            const data = new infoModel(
                {
                    url: target.url,
                    category: target.category,
                    ...product_info,
                },
                {
                    ordered: false,
                }
            )

            await data.save()
        } catch {
            console.log('> error for new model (info)')
        }

        return
    }

    if (product_info) {
        await checkInfoTarget({
            url,
            category,
            product_info,
        })
    } else if (product_links) {
        const product_links_filter = Array.from(
            new Set(product_links.filter(el => el.startsWith('http')))
        )

        try {
            const rightProductLinks = await Promise.all(
                product_links_filter
                    .filter(el => el.startsWith('http'))
                    .map(filterTaskTarget)
            )

            await taskModel.insertMany(
                rightProductLinks.filter(Boolean).map(el => ({
                    url: el,
                    category,
                }))
            )
        } catch {
            console.log('> error for new model (task)')
        }
    }

    console.log('Complete the request: ' + url)
    console.log(
        error || outOfStock
            ? {
                  error,
                  outOfStock,
                  url,
                  category,
              }
            : {
                  status: 'success',
                  type: product_info ? 'product' : 'category',
                  category,
                  data: product_info
                      ? product_info.name
                      : product_links
                      ? product_links.length
                      : null,
              }
    )

    await taskModel.updateOne(
        {
            url,
        },
        {
            status: error ? 'error' : outOfStock ? 'soldOut' : 'finish',
            type: error ? -1 : product_info ? 1 : 0,
        },
        {
            upsert: true,
        }
    )
}

module.exports = task
