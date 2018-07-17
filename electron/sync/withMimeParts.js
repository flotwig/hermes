const parse = require('emailjs-mime-parser')
const Message = require('../../src/model/Message')

/**
 * Takes a raw MIME-formatted email body and adds it to a `Message`
 * @param {Message} message
 * @param {string} mimeText
 */
const withMimeParts = (message, mimeText) => {
    const mimeMessage = parse(mimeText)
    console.log(message, mimeMessage)
    Object.assign(message, {
        // subject:,
        // fromAddress:,
        // toAddress:
        // receivedOn:,
        // snippet:
        // body:
    })
}

module.exports = withMimeParts