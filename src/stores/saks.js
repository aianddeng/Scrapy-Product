const getLink = ($, currentUrl) => {
    const product_links = $('.product .pdp-link a')
        .get()
        .map(el => 'https://www.saksfifthavenue.com' + $(el).attr('href'))

    if ($('.show-more button[data-url]').length) {
        try {
            const url = new URL(currentUrl)
            const num = (+url.searchParams.get('start') || 0) + 24
            url.searchParams.set('start', num)
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
            $('h1.product-name').first().text() &&
            $('h1.product-name').first().text().trim(),
        description:
            $('[data-adobelaunchaccordiontabname=details] .content')
                .first()
                .text() &&
            $('[data-adobelaunchaccordiontabname=details] .content')
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
    const isListPage = $('.product .pdp-link a').length
    const isProduct =
        $('h1.product-name').length +
        $('[data-adobelaunchaccordiontabname=details] .content').length

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
