const main = require('./main');
const Target = require('./tasks');

(async () => {
    const targets = Target.loadList().filter(el=>el.store==='ebay');

    await main(targets);
})();