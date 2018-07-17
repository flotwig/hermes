const mimeParser = require('emailjs-mime-parser').default
const base64 = require('emailjs-base64')
const Message = require('../../src/model/Message')

/**
 * Takes a raw MIME-formatted email body and adds it to a `Message`
 * @param {Message} message
 * @param {string} mimeText
 */
const withMimeParts = (message, mimeText) => {
    mimeText = base64.decode(mimeText)
    const mimeMessage = mimeParser(mimeText)
    console.log(message, mimeText)
    Object.assign(message, {
        // subject:,
        // fromAddress:,
        // toAddress:
        // receivedOn:,
        // snippet:
        bodyRaw: mimeText,
        bodyText: '',
    })
}

module.exports = withMimeParts