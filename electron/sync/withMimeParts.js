const mimeParser = require('emailjs-mime-parser').default
const base64 = require('emailjs-base64')
const {imapDecode, decode} = require('emailjs-utf7')
const Message = require('../../src/model/Message')
const moment = require('moment')

/**
 * Takes a raw MIME-formatted email body and adds it to a `Message`
 * @param {Message} message
 * @param {string} mimeText
 */
const withMimeParts = (message, mimeText) => {
    // gmail does some funky stuff with their Base64, gotta do some string replace before decoding
    let mime = mimeParser(base64.decode(mimeText))
    mimeBody = decode(mimeText)
    const mimeMessage = mimeParser(mimeBody)

    let bodyText = getText(mime)

    Object.assign(message, {
        subject: getHeader(mime, 'subject'),
        fromAddresses: getHeader(mime, 'from'),
        toAddresses: getHeader(mime, 'to'),
        receivedOn: moment(getHeader(mime, 'date')),
        snippet: bodyText.substr(0, bodyText.substr(0, 300).lastIndexOf(' ')),
        bodyRaw: mime.raw,
        bodyText: bodyText,
    })
    return message
}

const getHeader = (mime, key) => key in mime.headers ? mime.headers[key].map(h=>h.initial).join(','):undefined

const getText = (mime) => {
    let text = mime.childNodes.find((node) => node.contentType.value === 'text/plain')
    // check for plaintext first
    if (text) {
        let parts = text.raw.split('\n\n', 2)
        if (parts.length === 2) {
            return parts[1]
        }
    }
    // TODO: strip out HTML tags from html body and return a snippet
    return 'no text could be extractyed'
}

module.exports = withMimeParts