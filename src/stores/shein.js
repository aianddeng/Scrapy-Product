const getLink = ($, currentUrl) => {
    const product_links = $('#product-list-v2 .S-product-item__name a')
        .get()
        .map(el => 'https://us.shein.com' + $(el).attr('href'))

    if ($('.S-pagination__arrow-next').length) {
        try {
            const url = new URL(currentUrl)
            const num = (+url.searchParams.get('page') || 1) + 1
            url.searchParams.set('page', num)
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
            $('.product-intro__head-name').first().text() &&
            $('.product-intro__head-name').first().text().trim(),
        description:
            $('.product-intro__description-table').first().text() &&
            $('.product-intro__description-table').first().text().trim(),
        path: $('.bread-crumb__inner .bread-crumb__item')
            .get()
            .map(el => $(el).text() && $(el).text().trim()),
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
    const isListPage = $('#product-list-v2 .S-product-item__name a').length
    const isProduct =
        $('.product-intro__head-name').length +
        $('.product-intro__description-table').length

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
