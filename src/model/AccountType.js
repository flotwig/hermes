export default class AccountType {
    constructor(id, name, description, icon) {
        this.id = id
        this.name = name
        this.description = description
        this.icon = icon
    }
}

export const AccountTypes = [
    new AccountType('ews', 'Exchange Web Services', 'An account hosted on Microsoft\'s EWS (Office365, Outlook.com...)'),
    new AccountType('gmail', 'GMail', 'Email using Google Mail or GSuites'),
    new AccountType('other', 'Other', 'Use IMAP, POP3, and SMTP to configure your account'),
]