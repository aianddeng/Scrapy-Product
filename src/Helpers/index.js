const fs = require('fs');
const xlsx = require('node-xlsx');

class Helpers {
    static readFileAsync(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path,
                'utf-8',
                (error, response) => {
                    if (error) {
                        reject(error)
                    } else if (response) {
                        try {
                            resolve(
                                JSON.parse(response)
                            )
                        } catch {
                            resolve(response)
                        }
                    }
                    return null;
                }
            )
        })
    }

    static writeFileAsync(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path, data, (error) => {
                    return error ? reject(error) : resolve();
                }
            )
        })
    }

    static async writeToExcel(data) {
        console.log(
            Object.keys(data)
        );
        const buffer = Object.keys(data).map(
            category => ({
                name: category,
                data: [
                    Object.keys(
                        data[category][0]
                    ),
                    ...data[category].map(
                        el => Object.values(
                            el
                        ).map(ele => ele.toString()),
                    )
                ]
            })
        );

        await new Promise(resolve => fs.writeFile(`./Products.xls`, xlsx.build(buffer), (err) => {
            if (err) throw err;
            console.log('Write to xlsx finished');
            resolve(true);
        }))
    }
}

module.exports = Helpers;