const getLink = ($, currentUrl) => {
    const product_links = $(
        [
            '.product.item .product-item-link',
            '.pages .item a',
            '#nav li.level2.category-item a',
        ].join(',')
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

const getProduct = ($, url) => {
    const product_info = {
        name:
            $('h1.page-title').first().text() &&
            $('h1.page-title').first().text().trim(),
        description:
            $('#description .desc-main').first().text() &&
            $('#description .desc-main').first().text().trim(),
        path: (() => {
            const urlObj = new URL(url)
            return urlObj.pathname.split('/').slice(1, -1)
        })(),
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
    const isListPage = $(
        [
            '.product.item .product-item-link',
            '.pages .item a',
            '#nav li.level2.category-item a',
        ].join(',')
    ).length
    const isProduct = $('.product-info-main').length

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
