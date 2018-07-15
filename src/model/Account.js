const moment = require('moment')
const {AccountTypes} = require('./AccountType')

function Account(account) {
    this.id = 0
    this.accountTypeId = ''
    this.addedOn = moment()
    this.accessToken = ''
    this.refreshToken = ''
    this.expiresAt = moment(0)
    Object.assign(this, account)
}
Account.prototype.getAccountType = function() {
    return AccountTypes.find(x => x.id === this.accountTypeId)
}
Account.prototype.serialize = function() {
    return Object.assign({}, this, {
        addedOn: this.addedOn.toISOString(),
        expiresAt: this.expiresAt.toISOString()
    })
}
module.exports = { Account }