const getLink = $ => {
    const product_links = $(
        [
            '.product-grid .product-grid__row .product-grid-item a.product-grid-item__details-container',
            '.pagination .pagination__link',
        ].join(',')
    )
        .get()
        .map(el => 'https://www.nordstromrack.com' + $(el).attr('href'))

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
            $('.product-details__title-name').first().text() &&
            $('.product-details__title-name').first().text().trim(),
        description:
            $(
                '.product-details-section__term:contains(Details) + .product-details-section__definition'
            )
                .first()
                .text() &&
            $(
                '.product-details-section__term:contains(Details) + .product-details-section__definition'
            )
                .first()
                .text()
                .trim(),
        path: [
            ...$('.category-breadcrumbs li a')
                .get()
                .map(el => $(el).text() && $(el).text().trim()),
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
    const isListPage = $(
        '.product-grid .product-grid__row .product-grid-item a.product-grid-item__details-container'
    ).length
    const isProduct =
        $('.product-details__title-name').length +
        $(
            '.product-details-section__term:contains(Details) + .product-details-section__definition'
        ).length

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
