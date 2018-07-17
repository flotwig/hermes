const {AccountTypes} = require('../../src/model/AccountType')
const oauthParams = AccountTypes.find(x => x.id === 'gmail').oauthParams
const moment = require('moment')
const request = require('request')
const Folder = require('../../src/model/Folder')
const Message = require('../../src/model/Message')
const MessagePart = require('../../src/model/MessagePart')
const GMAIL_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/'
const Db = require('../db')
const {google} = require('googleapis')

function gmail(account) {
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
    this.gmail = google.gmail({version: 'v1', auth: this.token})
    console.log('token', this.token, 'gmail', this.gmail)
}

gmail.prototype.sync = function(onComplete) {
    this.syncLabels()
}

gmail.prototype.refreshAuth = function() {
    
}

gmail.prototype.syncLabels = function() {
    Db.selectFoldersForAccountId(this.account.id, (error, knownFolders) => {
        this.gmail.users.labels.list({userId:'me'}, (err, res) => {
            if (err) return console.log('syncing error', err)
            res.data.labels.forEach((label) => {
                let knownFolder = knownFolders.find(folder => folder.remoteRef === label.id)
                if (knownFolder) {
                    // folder exists, just check if we need to update name
                    if (knownFolder.name !== label.name) {
                        Db.updateFolderNameById(knownFolder.id, label.name)
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
                    Db.insertFolder(folder, (err)=>{
                        this.syncMessagesForFolder(Object.assign(folder, { id: this.lastID }))
                    })
                }
            });
        })
    })
}

gmail.prototype.syncMessagesForFolder = function(folder) {
    Db.selectMessageRemoteRefsForFolderId(folder.id, (err, knownMessages) => {
        this.gmail.users.messages.list({userId: 'me', labelIds: [folder.remoteRef]}, (err, res) => {
            if (err) return console.log('message sync err', err)
            res.data.messages.forEach((message) => {
                if (!knownMessages.find(x => x.remoteRef === message.id)) {
                    this.syncMessageById(id)
                }
            })
        })
    })
}

gmail.prototype.syncMessageById = function(id) {
    this.gmail.users.messages.get({userId: 'me', id: message.id}, (err, res) => {
        if (!res.data.payload) {
            console.log('no payload', err, res, res.data)
            return
        }
        let subject = res.data.payload.headers.find(x => x.name === 'Subject')
        let from = res.data.payload.headers.find(x => x.name === 'From')
        let to = res.data.payload.headers.find(x => x.name === 'To')
        let newMessage = new Message({
            folderId: folder.id,
            subject: subject ? subject.value : '',
            fromAddress: from ? from.value : '',
            toAddress: to ? to.value : '',
            receivedOn: moment(res.data.internalDate),
            snippet: res.data.snippet,
            remoteRef: res.data.id
        })
        Db.insertMessage(newMessage, (err) => {
            console.log(err, this)
            if (!res.data.payload.parts) {
                // body is payload, not multi-part
                let contentType = res.data.payload.headers.find(x => x.name==='Content-Type')
                let contentEncoding = res.data.payload.headers.find(x => x.name==='Content-Transfer-Encoding')
                let newMessagePart = new MessagePart({
                    messageId: this.lastID,
                    partId: res.data.payload.partId,
                    body: res.data.payload.body,
                    contentType: contentType ? contentType.value : '',
                    contentEncoding: contentEncoding ? contentEncoding.value : '',
                })
                Db.insertMessagePart(newMessagePart)
            } else {
                res.data.payload.parts.forEach((messagePart) => {
                    let contentType = messagePart.headers.find(x => x.name==='Content-Type')
                    let contentEncoding = messagePart.headers.find(x => x.name==='Content-Transfer-Encoding')
                    let newMessagePart = new MessagePart({
                        messageId: this.lastID,
                        partId: messagePart.partId,
                        body: messagePart.body.data,
                        contentType: contentType ? contentType.value : '',
                        contentEncoding: contentEncoding ? contentEncoding.value : '',
                    })
                    Db.insertMessagePart(newMessagePart)
                })
            }
        })
    })
}

module.exports = gmail