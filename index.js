const FileSystemAdapter = require('./FileSystemAdapter')

const myInstance = new FileSystemAdapter('inputs', 'utf8');

myInstance.merge([
    '1.txt',
    '2.txt',
    '3.txt',
    '4.txt',
    '5.txt',
    '6.txt',
    '7.txt',
    '8.txt',
], 'newfile.txt').catch(console.error)