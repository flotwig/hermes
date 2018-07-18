const moment = require('moment')

module.exports = function Message(message) {
    this.id = 0
    this.folderId = 0
    this.subject = ''
    this.fromAddresses = '' // comma-separated
    this.toAddresses = '' // comma-separated
    this.addedOn = moment(0)
    this.receivedOn = moment(0) // sender-supplied
    this.snippet = '' // brief body, at least 200 words
    this.bodyRaw = '' // MIME body
    this.bodyText = '' // what we think the body text is, for searching, etc.
    this.remoteRef = '' // remote ID for referencing
    this.unread = false
    if (message)
        Object.assign(this, message)
}