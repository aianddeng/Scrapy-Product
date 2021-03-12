const Helpers = require('./Helpers');
const mongoose = require('./sql');
const modelInit = require('./sql/model');

(async () => {
    const {
        infoModel,
    } = await modelInit();

    const fullList = await infoModel.find({});

    const categories = Array.from(new Set(
        fullList.map(el => el.category).map(el => el.slice(0, 30)).map(el => el.replace(/(\/|\\|\?|\*|\[|\])/g, ''))
    ));

    const data = {};
    categories.forEach(category => {
        const lins = fullList
            .filter(el => el.name && el.description && el.path && el.category)
            .filter(el => el.category === category)
            .map(
                el => ({
                    name: el.name,
                    description: el.description,
                    path: Array.from(new Set(el.path)).join('/')
                })
            );
        if (lins && lins.length) {
            data[category] = lins;
        }
    })


    console.log('Download categories: ', categories.join('/'));

    true
        && Object.keys(data).length
        && Object.values(data).length
        && await Helpers.writeToExcel(data);

    await mongoose.disconnect();
})();