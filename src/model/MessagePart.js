const moment = require('moment')

module.exports = function MessagePart(part) {
    this.id = 0
    this.messageId = 0
    this.partId = 0
    this.body = ''
    this.contentType = ''
    this.contentEncoding = ''
    if (part)
        Object.assign(this, part)
}