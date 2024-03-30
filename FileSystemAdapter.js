const {Worker, isMainThread, parentPort} = require('node:worker_threads');
const fs = require('node:fs/promises');
const os = require('node:os');

class FileSystemAdapter {

    constructor (baseDirectory, encoding) {
        this.baseDirectory = baseDirectory
        this.encoding = encoding
    }

    async merge(sources, destination) {
        const _sources = sources.map((source) => `${this.baseDirectory}/${source}`)
        const _destination = `${this.baseDirectory}/${destination}`

        await fs.rm(_destination)

        const file = await fs.open(_destination, fs.constants.O_CREAT | fs.constants.O_WRONLY)
        const promises = []
        let lastPosition = 0

        for (const source of _sources) {
            let res, rej
            const promise = new Promise((ress, rejj) => {
                res = ress
                rej = rejj
            })
            const {size} = await fs.stat(source)

            const worker = new Worker('./worker.js', {
                workerData: {
                    source,
                    lastPosition,
                }
            });

            lastPosition += size

            worker.on('message', async ({data, lastPosition}) => {
                await file.write(
                    data,
                    0,
                    size,
                    lastPosition 
                )

                console.log(
                    size,
                    lastPosition )
            })

            worker.on('error', (err) => {
                console.error('something went wrong', err)
                rej()
            })

            worker.on('exit', () => {
                // console.log('A worker exited');
                res()
            })

            promises.push(promise)
        }

        await Promise.all(promises)
    }

}

module.exports = FileSystemAdapter