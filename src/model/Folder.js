const moment = require('moment')

function Folder(folder) {
    this.id = 0
    this.name = ''
    this.accountId = 0
    this.parentId = 0
    this.lastSynced = moment(0)
    this.remoteRef = ''
    this.shouldSync = false
    if (folder) {
        Object.assign(this, folder, {
            lastSynced: moment(folder.lastSynced)
        })
    }
}

module.exports = Folder