const { AccountTypes } = require('../../src/model/AccountType')
const oauthParams = AccountTypes.find(x => x.id === 'gmail').oauthParams
const moment = require('moment')
const request = require('request')
const Folder = require('../../src/model/Folder')
const Message = require('../../src/model/Message')
const { google } = require('googleapis')
const withMimeParts = require('./withMimeParts')


const GMAIL_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/'

const MIN_DELAY = 20
var delay_ms = 100

function gmail(account, db) {
    this.db = db
    this.account = account
    this.token = new google.auth.OAuth2({
        clientId: oauthParams.clientId,
        clientSecret: oauthParams.clientSecret,
        redirectUri: oauthParams.redirectUri,
        tokenUrl: oauthParams.tokenUri
    })
    console.log(account)
    this.token.setCredentials({
        refresh_token: account.refreshToken,
        access_token: account.accessToken,
        token_type: 'Bearer',
        expiry_date: moment(account.expiresAt)
    })
    this.gmail = google.gmail({ version: 'v1', auth: this.token })
    console.log('token', this.token, 'gmail', this.gmail)
}

gmail.prototype.delay = function (apiFunction, apiArgs, userCb) {
    console.log('this', this, apiFunction)
    setTimeout((apiFunction) => apiFunction(apiArgs, (error, res) => {
        // Linear increase exponential increase
        // see i learned something in school
        if (error && res.status === 429) {
            delay_ms = delay_ms * 2
            // requeue
            this.delay(apiFunction, apiArgs, userCb)
        } else {
            if (!error) {
                delay_ms = delay_ms - 1
                if (delay_ms > MIN_DELAY) delay_ms = MIN_DELAY
            }
            userCb(error, res)
        }
    }), delay_ms, apiFunction.bind(this.gmail.users.labels.getRoot()))
}

gmail.prototype.sync = function (onComplete) {
    this.syncLabels()
}

gmail.prototype.refreshAuth = function () {

}

gmail.prototype.syncLabels = function () {
    this.db.selectFoldersForAccountId(this.account.id, (error, knownFolders) => {
        this.delay(this.gmail.users.labels.list, { userId: 'me' }, (err, res) => {
            if (!res.data.labels) return
            if (err) return console.log('syncing error', err)
            res.data.labels.forEach((label) => {
                let knownFolder = knownFolders.find(folder => folder.remoteRef === label.id)
                if (knownFolder) {
                    // folder exists, just check if we need to update name
                    if (knownFolder.name !== label.name) {
                        this.db.updateFolderNameById(knownFolder.id, label.name)
                    }
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
                        this.syncMessagesForFolder(Object.assign(folder, { id: this.lastID }))
                    })
                }
            });
        })
    })
}

gmail.prototype.syncMessagesForFolder = function (folder) {
    this.db.selectMessageRemoteRefsForFolderId(folder.id, (err, knownMessages) => {
        this.delay(this.gmail.users.messages.list, { userId: 'me', labelIds: [folder.remoteRef] }, (err, res) => {
            if (!res.data.messages) return
            if (err) return console.log('message sync err', err)
            console.log('messages ', res.data)

            res.data.messages.forEach((message) => {
                if (!knownMessages.find(x => x.remoteRef === message.id)) {
                    this.syncMessageById(message.id, folder.id)
                }
            })
        })
    })
}

gmail.prototype.syncMessageById = function (id, folderId) {
    this.delay(this.gmail.users.messages.get, {
        userId: 'me',
        id,
        format: 'raw'
    },
        (err, res) => {
            // sync in RAW format and let MIME parser get what we need
            let message = withMimeParts(new Message({
                folderId,
                addedOn: moment(),
                snippet: res.data.snippet,
                bodyRaw: res.data.raw,
                remoteRef: res.data.id
            }), res.data)
        })
}

module.exports = gmail