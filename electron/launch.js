const electron = require('electron')
const child_process = require('child_process')

// will print something similar to /Users/maf/.../Electron
console.log('Launching Electron from ' + electron)

// spawn Electron
const child = child_process.spawn(electron, [__dirname + '/index.js', process.argv[2], '--inspect=5858'])
