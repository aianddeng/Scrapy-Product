const handle = ($) => {
    const outOfStock = $('#searchPage h2 + p:contains(out of stock)').length;
    const isListPage = $('.srp-results .s-item__link').length;
    const isProduct = $('#itemInformation li').length;
    if (outOfStock) {
        return {
            outOfStock
        }
    } else if (isProduct) {
        const product_info = {
            name: $('#overview h1').text().trim(),
            description: $('#itemInformation li').text().trim(),
            path: $('.breadcrumb a').get().map(
                el => $(el).text()
            )
        };

        // 如果数据完整，存入数据库中
        if (product_info.name && product_info.description && product_info.path) {
            return {
                product_info
            }
        }
    } else if (isListPage) {
        const product_links = $('.srp-results .s-item__link').get().map(el => $(el).attr('href')).concat(
            $('.ebayui-pagination__control[rel=next]').first().attr('href')
        );

        return {
            product_links
        };
    }

    return {
        error: true
    }
}

module.exports = handle;