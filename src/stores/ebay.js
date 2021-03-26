const getLink = ($, url) => {
    let product_links = []

    if (url.match(/^https:\/\/www\.ebay\.com\/(b|sch)\/(.+)/)) {
        product_links = $('.srp-results .s-item__link')
            .get()
            .map(el => $(el).attr('href'))
            .concat(
                $(
                    '.ebayui-pagination__ol a, .s-pagination .pagination__items a'
                )
                    .get()
                    .map(el => $(el).attr('href'))
            )
    }

    if (product_links.length) {
        return {
            product_links,
        }
    } else {
        return true
    }
}

const getProduct = ($, url) => {
    const product_info = {
        name: $('head>title').text() && $('head>title').text().trim(),
        description: [
            $('.app-item-description__body--text').first().text(),
            $('.item-desc .item-snippet.short').first().text(),
            $('[name=description]').attr('content') &&
                $('[name=description]').attr('content').trim(),
        ]
            .filter(Boolean)
            .shift(),
        path: [
            ...$('#bc a [itemprop=name]')
                .get()
                .map(el => $(el).text()),
            ...$('.breadcrumb li a')
                .get()
                .map(el => $(el).text()),
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
    const outOfStock = $('#wrapper .status--4XX').length
    const isListPage = $('.srp-results .s-item__link').length
    const isProduct =
        $('#bc a [itemprop=name]').length + $('.breadcrumb li a').length

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
