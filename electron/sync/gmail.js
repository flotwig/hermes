const {AccountTypes} = require('../../src/model/AccountType')
const oauthParams = AccountTypes.find(x => x.id === 'gmail').oauthParams
const moment = require('moment')
const request = require('request')
const Folder = require('../../src/model/Folder')
const Message = require('../../src/model/Message')
const MessagePart = require('../../src/model/MessagePart')
const GMAIL_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/'
const Db = require('../db')

function gmail(account) {
    this.account = account
    this.refreshToken = account.refreshToken
    this.accessToken = account.accessToken
    this.expiresAt = moment(account.expiresAt)
}

gmail.prototype.sync = function(onComplete) {
    this.syncLabels()
}

gmail.prototype.refreshAuth = function() {
    
}

gmail.prototype.syncLabels = function() {
    Db.selectFoldersForAccountId(this.account.id, (error, knownFolders) => {
        this.request('me/labels', (err, res, body) => {
            body.labels.forEach((label) => {
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
                        this.syncMessagesForFolder(Object.assign(folder, {id: this.lastID}))
                    })
                }
            });
        })
    })
}

gmail.prototype.syncMessagesForFolder = function(folder) {
    Db.selectMessageRemoteRefsForFolderId(folder.id, (err, knownMessages) => {
        this.request('me/messages?labelIds[0]='+folder.remoteRef, (err, res, body) => {
            body.messages.forEach((message) => {
                if (!knownMessages.find(x => x.remoteRef === message.id)) {
                    this.request('me/messages/' + message.id, (err, res, body) => {
                        if (!body.payload) {
                            console.log('no payload', err, res, body)
                            return
                        }
                        let subject = body.payload.headers.find(x => x.name === 'Subject')
                        let from = body.payload.headers.find(x => x.name === 'From')
                        let to = body.payload.headers.find(x => x.name === 'To')
                        let newMessage = new Message({
                            folderId: folder.id,
                            subject: subject ? subject.value : '',
                            fromAddress: from ? from.value : '',
                            toAddress: to ? to.value : '',
                            receivedOn: moment(body.internalDate),
                            snippet: body.snippet,
                            remoteRef: body.id
                        })
                        Db.insertMessage(newMessage, (err) => {
                            console.log(err, this)
                            return
                            if (!body.payload.parts) {
                                // body is payload, not multi-part
                                let contentType = body.payload.headers.find(x => x.name==='Content-Type')
                                let contentEncoding = body.payload.headers.find(x => x.name==='Content-Transfer-Encoding')
                                let newMessagePart = new MessagePart({
                                    messageId: this.lastID,
                                    partId: body.payload.partId,
                                    body: body.payload.body,
                                    contentType: contentType ? contentType.value : '',
                                    contentEncoding: contentEncoding ? contentEncoding.value : '',
                                })
                                Db.insertMessagePart(newMessagePart)
                            } else {
                                body.payload.parts.forEach((messagePart) => {
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
            })
        })
    })
}

gmail.prototype.request = function(endpoint, cb) {
    return request({
        url: GMAIL_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + this.accessToken
        },
        json: true
    }, cb)
}


module.exports = gmail