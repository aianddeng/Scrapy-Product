const getLink = ($, currentUrl) => {
    const product_links = $(
        '#primary .subCategory .view-all-grid-page a, #search-result-items .product-name a'
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
            $('h1 .pdp-name-wrapper').first().text() &&
            $('h1 .pdp-name-wrapper').first().text().trim(),
        description:
            $('.pdp-description-wrapper').first().text() &&
            $('.pdp-description-wrapper').first().text().trim(),
        path: Array.from(
            new Set(
                $('.breadcrumb>a')
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
    const isListPage = $(
        '#primary .subCategory .view-all-grid-page a, #search-result-items .product-name a'
    ).length
    const isProduct =
        $('h1 .pdp-name-wrapper').length + $('.pdp-description-wrapper').length

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
