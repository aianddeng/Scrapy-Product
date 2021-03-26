class Helpers {
    static getTitle(
        target,
        attr,
        keywords = null
    ) {
        let wordKey

        if (typeof target === 'undefined') {
        } else if (typeof target === 'string') {
            wordKey = target
        } else {
            if (typeof attr === 'string') {
                wordKey = attr
                    ? target.first().attr(attr)
                    : target.first().text()
            } else {
                wordKey = attr
                    .map(ele => target.first().attr(ele))
                    .filter(ele => Boolean(ele))
                    .shift()
            }
        }

        if (keywords) {
            if (typeof keywords === 'string') {
                if (wordKey.toUpperCase().includes(keywords.toUpperCase())) {
                    keywords = null
                }
            } else if (keywords instanceof Array) {
                keywords = keywords.filter(
                    x => !wordKey.toUpperCase().includes(x.toUpperCase())
                )
                if (!keywords.length) keywords = null
            } else {
                keywords = keywords.first().text()
                if (wordKey.toUpperCase().includes(keywords.toUpperCase())) {
                    keywords = null
                }
            }

            if (keywords) {
                wordKey = [wordKey]
                    .concat(keywords)
                    .join(' | ')
                    .replace(/\s{2,}/g, ' ')
            }
        }

        this.title = wordKey?.trim()

        return Boolean(this.title)
    }

    static getPageUrl(
        target,
        attr = 'href',
        params = null
    ) {
        let wordKey

        if (typeof target === 'undefined') {
        } else if (typeof target === 'string') {
            wordKey = target
        } else {
            if (typeof attr === 'string') {
                wordKey = attr
                    ? target.first().attr(attr)
                    : target.first().text()
            } else {
                wordKey = attr
                    .map(ele => target.first().attr(ele))
                    .filter(ele => Boolean(ele))
                    .shift()
            }
        }

        if (!wordKey) {
            return false
        } else if (wordKey?.startsWith('//')) {
            wordKey = location.protocol + wordKey
        } else if (wordKey?.startsWith('/')) {
            wordKey = location.origin + wordKey
        } else if (wordKey?.startsWith('..')) {
            wordKey =
                location.href.split('/').slice(0, -2).join('/') +
                wordKey.replace('..', '')
        }

        if (params && wordKey.startsWith('http')) {
            const searchParamsUrl = new URL(wordKey)
            const url = new URL(wordKey)
            url.search = ''
            url.hash = ''
            if (params.length) {
                for (const param of params) {
                    const value = searchParamsUrl.searchParams.get(param)
                    value && url.searchParams.set(param, value)
                }
            }
            this.pageUrl = url.href
        } else {
            this.pageUrl = wordKey
        }

        return Boolean(this.pageUrl)
    }

    static getKeywords(target, exceptWords = []) {
        let wordKey = [];

        // toString.
        if (!target) {
            ;
        } else if (target instanceof Array) {
            wordKey = target.map(
                elem => elem.trim()
            );
        } else {
            wordKey = target.get().map(
                elem => $(elem).text()
            ).join('/').split('/').map(
                elem => elem.trim()
            )
        }

        // filter keywords.
        wordKey = wordKey
            .filter(
                Boolean
            ).filter(
                (ele, index, array) => {
                    if (
                        !index
                        && ele.toUpperCase() === 'HOME'
                    ) {
                        return false;
                    } else if (
                        index === (array.length - 1)
                        && this.title.toUpperCase().includes(ele.toUpperCase())
                    ) {
                        return false;
                    }

                    return true;
                }
            ).filter(
                elem => !(exceptWords.map(
                    elem => elem.toUpperCase()
                ) as any).includes(
                    elem.toUpperCase()
                )
            )

        // duplicate remove.
        this.keywords = Array.from(
            new Set(wordKey)
        )


        return Boolean(this.keywords?.length);
    }
}

module.exports = Helpers;