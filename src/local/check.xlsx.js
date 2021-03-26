const Tasks = require('../tasks')

class Check {
    static async storeTargetLength() {
        const tasks = Tasks.loadList()
        const storeNames = Array.from(new Set(tasks.map(task => task.store)))

        const storeArray = storeNames.map(storeName => ({
            store: storeName,
            length: tasks.filter(el => el.store === storeName).length,
        }))

        console.log('Store Array Object: ', storeArray)
        console.log('Store length: ', storeArray.length)
    }

    static async checkReplaceTask() {
        const tasks = Tasks.loadList()
        const categories = tasks.map(el => el.category)

        const errorTasks = tasks.filter(
            el =>
                categories.indexOf(el.category) !==
                categories.lastIndexOf(el.category)
        )

        console.log(`Error task length: ${errorTasks.length}/${tasks.length}`)
    }
}

Check.storeTargetLength()
Check.checkReplaceTask()
