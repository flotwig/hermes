const {app, BrowserWindow} = require('electron')

app.on('ready', () => {
    var win = new BrowserWindow({width: 800, height: 600})
    win.loadURL(process.argv[2])
}) 