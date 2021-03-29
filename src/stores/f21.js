const getLink = ($, currentUrl) => {
    const product_links = $(
        '.product-grid a.product-tile__anchor--product-info'
    )
        .get()
        .map(el => 'https://www.forever21.com' + $(el).attr('href'))

    if ($('.pagination__item[aria-label*=Next][data-url]').length) {
        try {
            const url = new URL(currentUrl)
            const num = (+url.searchParams.get('start') || 0) + 60
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
            $('h1.pdp__name').first().text() &&
            $('h1.pdp__name').first().text().trim(),
        description:
            $('.d_wrapper h3:contains(Detail) + .d_content').first().text() &&
            $('.d_wrapper h3:contains(Detail) + .d_content')
                .first()
                .text()
                .trim(),
        path: Array.from(
            new Set(
                $('.breadcrumbs a')
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
    const isListPage = $('.product-grid a.product-tile__anchor--product-info')
        .length
    const isProduct =
        $('h1.pdp__name').length +
        $('.d_wrapper h3:contains(Detail) + .d_content').length

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
