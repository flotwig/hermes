const ApiActions = require('../src/ApiActions')
const {ipcMain} = require('electron')
const Db = require('./db')

var Api = {
    handleRequest: (event, cbId, action, payload) => {
        console.log('received request for action ', event, cbId, action, payload)
        Api.actions[action](payload, (response, error)=>Api.sendResponse(event.sender, cbId, response, error))
    },
    sendResponse: (sender, cbId, response, error) => {
        sender.send('api-response', cbId, response, error)
    },
    sendStoreUpdate: (update) => {
        mainWindow.send('store-update', update)
    },
    actions: {}
}

Api.actions[ApiActions.ADD_ACCOUNT] = (payload, cb) => {
    Db.insertAccount(payload, (error) => {
        if (!error) {
            Db.selectAccounts((err, accounts) => Api.sendStoreUpdate({ accounts }))
            Sync.beginSyncing(Object.assign(payload, {id:this.lastID}))
        }
        cb(this, error)
    })
}

module.exports = Api