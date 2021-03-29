const getLink = ($, currentUrl) => {
    const product_links = $(
        ['.result-tile .result-tile-below .d-block', '.pagination a'].join(',')
    )
        .get()
        .map(el => 'https://www.dillards.com' + $(el).attr('href'))

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
            $('.product__title--desc').first().text() &&
            $('.product__title--desc').first().text().trim(),
        description:
            $('.product-description').first().text() &&
            $('.product-description').first().text().trim(),
        path: [
            $('.product__title--brand').first().text() &&
                $('.product__title--brand').first().text().trim(),
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
    const isListPage = $('.result-tile .result-tile-below .d-block').length
    const isProduct =
        $('.product__title--desc').length + $('.product-description').length

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
