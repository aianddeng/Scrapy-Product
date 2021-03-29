const getLink = ($, url) => {
    const currentUrl = new URL(url)
    const product_links = [
        ...$('#product-results-query-anchor ~ section h3 a')
            .get()
            .map(el => 'https://www.nordstrom.com' + $(el).attr('href')),
        ...$('footer ul li a[href^="?page="]')
            .get()
            .map(el => currentUrl.hostname + currentUrl.pathname + el),
    ]

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
            $('#product-page-product-title-lockup h1').first().text() &&
            $('#product-page-product-title-lockup h1').first().text().trim(),
        description:
            $('#product-page-selling-statement').first().text() &&
            $('#product-page-selling-statement').first().text().trim(),
        path: ['Women', 'Handbags', 'Crossbody Bags'],
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
    const isListPage = $('#product-results-query-anchor ~ section h3 a').length
    const isProduct =
        $('#product-page-product-title-lockup h1').length +
        $('#product-page-selling-statement').length

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
