const {app, BrowserWindow, ipcMain} = require('electron')

const Api = require('./api.js')
global.Sync = require('./sync.js')

Sync.init()


var mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        autoHideMenuBar: true
    })
    let argUrl = process.argv[3]
    if (argUrl) {
        mainWindow.loadURL(argUrl)
    } else {
        mainWindow.loadFile(app.getAppPath() + '/build/index.html')
    }

    ipcMain.on('api-request', Api.handleRequest.bind(Api))

    global.mainWindow = mainWindow
})

console.log = (...log) => {
    mainWindow.webContents.send('log-message', log)
}