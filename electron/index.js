const {app, BrowserWindow, ipcMain} = require('electron')

const Api = require('./api.js')
global.Sync = require('./sync.js')

Sync.init()


var mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow(
        {
            width: 800, 
            height: 600,
            autoHideMenuBar: true
        }
    )
    mainWindow.loadURL(process.argv[3])
})

console.log = (...log) => {
    mainWindow.webContents.send('log-message', log)
}

ipcMain.on('api-request', Api.handleRequest.bind(Api))