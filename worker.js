const {Worker, isMainThread, workerData, parentPort} = require('node:worker_threads');
const fs = require('node:fs/promises');

(async () => {
    const file = await fs.readFile(workerData.source)

    console.log(workerData.source)
    parentPort.postMessage({
        data: file,
        lastPosition: workerData.lastPosition,
    })
})()

