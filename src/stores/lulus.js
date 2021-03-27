// const Helpers = require('./Helpers')

const getLink = ($, currentUrl) => {
    const product_links = $(
        ['.c-ptf .c-ptf__info', 'a.c-btn--light:contains(NEXT)'].join(',')
    )
        .get()
        .map(el => 'https://www.lulus.com' + $(el).attr('href'))

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
            $('h1.c-heading').first().text() &&
            $('h1.c-heading').first().text().trim(),
        description:
            $('.c-prod__desc>div').first().text() &&
            $('.c-prod__desc>div').first().text().trim(),
        path: [
            $('.c-prod__brand').first().text() &&
                $('.c-prod__brand').first().text().trim(),
        ],
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
    const isListPage = $('.c-ptf .c-ptf__info').length
    const isProduct = $('h1.c-heading').length + $('.c-prod__desc>div').length

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
