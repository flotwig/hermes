const { AccountTypes } = require('../../src/model/AccountType')
const oauthParams = AccountTypes.find(x => x.id === 'gmail').oauthParams
const moment = require('moment')
const request = require('request')
const Folder = require('../../src/model/Folder')
const Message = require('../../src/model/Message')
const { google } = require('googleapis')
const withMimeParts = require('./withMimeParts')
const semaphore = require('semaphore')

const GMAIL_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/'

const MIN_DELAY = 500
const MAX_CONCURRENT = 1

function gmail(account, db) {
    this.db = db
    this.account = account
    this.delay_ms = 500
    this.concurrent = 0
    this.token = new google.auth.OAuth2({
        clientId: oauthParams.clientId,
        clientSecret: oauthParams.clientSecret,
        redirectUri: oauthParams.redirectUri,
        tokenUrl: oauthParams.tokenUri
    })
    this.token.setCredentials({
        refresh_token: account.refreshToken,
        access_token: account.accessToken,
        token_type: 'Bearer',
        expiry_date: moment(account.expiresAt)
    })
    this.gmail = google.gmail({ version: 'v1', auth: this.token })
    if (moment(account.expiresAt) <= moment() || true) {
        this.token.refreshAccessToken().then((data) => {
            Object.assign(account, {
                accessToken: data.credentials.access_token,
                expiresAt: moment(data.credentials.expiry_data),
                refreshToken: data.credentials.refresh_token
            })
            this.db.updateAccount(account)
        }).error(err => console.log('error refreshing gmail access token', { err, account }))
    }
    this.sema = semaphore(MAX_CONCURRENT)
}

gmail.prototype.queue = function(task, callback) {
    this.sema.take(()=>{
        task.method.bind(this.gmail.users)(task, callback)
        setTimeout(this.sema.leave, 100)
    })
}

gmail.prototype.sync = function (onComplete) {
    this.syncLabels()
}

gmail.prototype.refreshAuth = function () {

}

gmail.prototype.syncLabels = function () {
    this.db.selectFoldersForAccountId(this.account.id, (error, knownFolders) => {
        this.queue( { method: this.gmail.users.labels.list, userId: 'me' }, (err, res) => {
            if (err) return console.log(err, res)
            if (!res.data.labels) return
            if (err) return console.log('syncing error', err)
            res.data.labels.forEach((label) => {
                let knownFolder = knownFolders.find(folder => folder.remoteRef === label.id)
                if (knownFolder) {
                    // folder exists, just check if we need to update name
                    if (knownFolder.name !== label.name) {
                        this.db.updateFolderNameById(knownFolder.id, label.name)
                    }
                    if (knownFolder.shouldSync)
                        this.syncMessagesForFolder(knownFolder)
                } else {
                    // we don't know of this folder, create it
                    let folder = new Folder({
                        name: label.name,
                        accountId: this.account.id,
                        remoteRef: label.id,
                        lastSynced: moment().toISOString(),
                        shouldSync: label.type === 'system'
                    })
                    this.db.insertFolder(folder, (err) => {
                        if (folder.shouldSync)
                            this.syncMessagesForFolder(Object.assign(folder, { id: this.lastID }))
                    })
                }
            });
        })
    })
}

gmail.prototype.syncMessagesForFolder = function (folder) {
    this.db.selectMessageRemoteRefsForFolderId(folder.id, (err, knownMessages) => {
        this.queue({ method: this.gmail.users.messages.list, userId: 'me', labelIds: [folder.remoteRef] }, (err, res) => {
            if (!res.data.messages) return
            if (err) return console.log('message sync err', err)

            res.data.messages.forEach((message) => {
                if (!knownMessages.find(x => x.remoteRef === message.id)) {
                    this.syncMessageById(message.id, folder)
                }
            })
        })
    })
}

gmail.prototype.syncMessageById = function (id, folder) {
    this.queue({
        method: this.gmail.users.messages.get,
        userId: 'me',
        id,
        format: 'raw'
    },
        (err, res) => {
            // sync in RAW format and let MIME parser get what we need
            this.db.insertMessage(withMimeParts(new Message({
                folder,
                addedOn: moment(),
                snippet: res.data.snippet,
                remoteRef: res.data.id,
                unread: res.data.labelIds.includes('UNREAD'),
            }), res.data.raw.replace(/-/g, '+').replace(/_/g, '/') ))
        })
}

module.exports = gmail