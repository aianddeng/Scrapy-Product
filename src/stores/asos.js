const getLink = ($, currentUrl) => {
    const product_links = $(
        '[data-auto-id=productTile]>a, [data-auto-id=loadMoreProducts]'
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
            $('.product-hero h1').first().text() &&
            $('.product-hero h1').first().text().trim(),
        description: $('div.product-description ul li').length
            ? $('div.product-description ul li')
                  .get()
                  .map(el => $(el).text())
                  .concat('')
                  .join('. ')
                  .trim()
            : $('div.product-description').text(),
        path: Array.from(
            new Set(
                $('[aria-label=breadcrumbs] a')
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
        '[data-auto-id=productTile]>a, [data-auto-id=loadMoreProducts]'
    )
    const isProduct =
        $('.product-hero h1').length + $('div.product-description').length

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
