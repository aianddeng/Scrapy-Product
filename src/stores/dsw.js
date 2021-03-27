// const Helpers = require('./Helpers')

const getLink = ($, currentUrl) => {
    const product_links = $([
        '.product-grid__products .product-tile__detail-wrapper a',
    ])
        .get()
        .map(el => 'https://www.dsw.com' + $(el).attr('href'))

    if ($('.pagination-next:not(.disabled)').length) {
        try {
            const url = new URL(currentUrl)
            const num = (+url.searchParams.get('No') || 1) + 1
            url.searchParams.set('No', num)
            product_links.push(url.href)
        } catch {}
    }

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
            $('h1#product-name').first().text() &&
            $('h1#product-name').first().text().trim(),
        description:
            $('[itemprop=description]').first().text() &&
            $('[itemprop=description]').first().text().trim(),
        path: [
            $('#brand-name').first().text() &&
                $('#brand-name').first().text().trim() &&
                $('#brand-name').first().text().trim().replace('Shop all ', ''),
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
        '.product-grid__products .product-tile__detail-wrapper a'
    ).length
    const isProduct =
        $('h1#product-name').length + $('[itemprop=description]').length

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
