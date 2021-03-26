// const Helpers = require('./Helpers')

const getLink = $ => {
    const product_links = $(
        [
            '.items .cell .productDescription .productDescLink',
            '.pagination .next-page a',
        ].join(',')
    )
        .get()
        .map(el => 'https://www.macys.com' + $(el).attr('href'))

    if (product_links.length) {
        return {
            product_links,
        }
    } else {
        return {
            error: true,
        }
    }
}

const getProduct = $ => {
    const product_info = {
        name:
            $('h1.p-name').first().text() &&
            $('h1.p-name').first().text().trim(),
        description:
            $('[itemprop=description]').first().text() &&
            $('[itemprop=description]').first().text().trim(),
        path: $('.show-for-large .breadcrumbs-container a')
            .get()
            .map(el => $(el).text() && $(el).text().trim()),
    }

    if (product_info.name && product_info.description && product_info.path) {
        return {
            product_info,
        }
    } else {
        return {
            error: true,
        }
    }
}

const handle = ($, url) => {
    const outOfStock = false
    const isListPage = $('.items .cell .productDescription .productDescLink')
        .length
    const isProduct =
        $('[data-el=order-panel]').length +
        $('.show-for-large .breadcrumbs-container a').length

    if (outOfStock) {
        return {
            outOfStock,
        }
    } else if (isProduct) {
        return getProduct($, url)
    } else if (isListPage) {
        return getLink($, url)
    }

    return {
        error: true,
    }
}

module.exports = handle
