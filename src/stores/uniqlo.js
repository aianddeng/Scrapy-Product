const getLink = ($, currentUrl) => {
    const product_links = $('.product-tile .product-name .name-link')
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
            $('h1 .product-name').first().text() &&
            $('h1 .product-name').first().text().trim(),
        description:
            $('[aria-labelledby=tab-product-details] .tab-content-text')
                .first()
                .text() &&
            $('[aria-labelledby=tab-product-details] .tab-content-text')
                .first()
                .text()
                .trim(),
        path: Array.from(
            new Set(
                $('.breadcrumb a')
                    .get()
                    .map(el => $(el).text() && $(el).text().trim())
            )
        ),
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
    const isProduct =
        $('h1 .product-name').length +
        $('[aria-labelledby=tab-product-details] .tab-content-text').length

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
