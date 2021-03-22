const getLink = ($) => {
    const product_links = $('.s-search-results.s-result-list.s-main-slot .s-result-item[data-component-type=s-search-result] h2 a').get().map(el => $(el).attr('href')).concat(
        $('.a-pagination a').get().map(el => $(el).attr('href'))
    ).map(
        el => 'https://www.amazon.com' + el
    )

    if (product_links.length) {
        return {
            product_links
        };
    } else {
        return {
            error: true
        };
    }
}

const getProduct = ($) => {
    const product_info = {
        name: $('#productTitle').text() && $('#productTitle').text().trim(),
        description: $('#productDescription').text() && $('#productDescription').text().trim(),
        path: $('.a-breadcrumb .a-link-normal').get().map(
            el => $(el).text() && $(el).text().trim()
        )
    };

    if (product_info.name && product_info.description && product_info.path) {
        return {
            product_info
        }
    } else {
        return {
            error: true
        }
    }
}

const handle = ($, url) => {
    const outOfStock = $('#wrapper .status--4XX').length;
    const isListPage = $('.s-search-results.s-result-list.s-main-slot .s-result-item[data-component-type=s-search-result] h2 a').length;
    const isProduct = $('#productTitle').length + $('.a-breadcrumb .a-link-normal').length;

    if (outOfStock) {
        return {
            outOfStock
        }
    } else if (isProduct) {
        return getProduct($, url);
    } else if (isListPage) {
        return getLink($, url);
    }

    return {
        error: true
    }
}

module.exports = handle;