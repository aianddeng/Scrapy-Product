const handle = ($) => {
    const outOfStock = $('#searchPage h2 + p:contains(out of stock)').length;
    const isListPage = $('#searchPage a[data-style-id]').length;
    const isProduct = $('#itemInformation li').length;
    if (outOfStock) {
        return {
            outOfStock
        }
    } else if (isProduct) {
        const product_info = {
            name: $('#overview h1').text().trim(),
            description: $('#itemInformation li').text().trim(),
            path: $('#breadcrumbs a').get().slice(1).map(
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
        const product_links = $('#searchPage a[data-style-id]').get().map(el => 'https://www.zappos.com' + $(el).attr('href')).concat(
            $('a[rel=next]').first().attr('href') ? 'https://www.zappos.com' + $('a[rel=next]').first().attr('href') : ''
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