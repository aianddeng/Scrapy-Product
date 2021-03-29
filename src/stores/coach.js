const getLink = ($, currentUrl) => {
    const product_links = $(
        '.product-tile .product-name .name-link, .pagination a'
    )
        .get()
        .map(el => $(el).attr('href'))

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
            $('h1.product-name-desc').first().text() &&
            $('h1.product-name-desc').first().text().trim(),
        description:
            $('[name=description]').first().attr('content') &&
            $('[name=description]').first().attr('content').trim(),
        path: $('.product-detail[data-categorypath]')
            .attr('data-categorypath')
            .split('/'),
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
    const isListPage = $('.product-tile .product-name .name-link').length
    const isProduct = $('h1.product-name-desc').length

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
