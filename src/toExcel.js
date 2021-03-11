const Helpers = require('./Helpers');
const modelInit = require('./sql/model');

(async () => {
    const {
        infoModel,
    } = await modelInit();

    const fullList = await infoModel.find({});

    const categories = Array.from(new Set(
        fullList.map(el => el.category)
    ));

    const data = {};
    categories.forEach(category => {
        data[category] = fullList
            .filter(el => el.name && el.description && el.path && el.category)
            .filter(el => el.category === category)
            .map(
                el => ({
                    name: el.name,
                    description: el.description,
                    path: el.path.join('/')
                })
            );
    })


    console.log('Download categories: ', categories.join('/'));

    true
        && Object.keys(data).length
        && Object.values(data).length
        && await Helpers.writeToExcel(data)
})();