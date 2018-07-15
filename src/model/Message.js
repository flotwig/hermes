const moment = require('moment')

module.exports = function Message(message) {
    this.id = 0
    this.folderId = 0
    this.subject = ''
    this.fromAddress = ''
    this.toAddress = ''
    this.addedOn = moment(0)
    this.receivedOn = moment(0)
    this.snippet = ''
    this.remoteRef = ''
    if (message)
        Object.assign(this, message)
}