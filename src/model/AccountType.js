function AccountType(id, name, description, icon, oauthParams) {
    this.id = id
    this.name = name
    this.description = description
    this.icon = icon
    this.oauthParams = oauthParams
}

const AccountTypes = [
    //new AccountType('ews', 'Exchange Web Services', 'An account hosted on Microsoft\'s EWS (Office365, Outlook.com...)'),
    new AccountType('gmail', 'GMail', 'Email using Google Mail or GSuites', 'icon', {
        authUri: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUri: "https://www.googleapis.com/oauth2/v4/token",
        clientId: "730782245541-0ud5h4frebvr4r7tns0bmngb5l77lehc.apps.googleusercontent.com",
        clientSecret: "CZtK77OEqPnf-0PtX5OXJXw5",
        redirectUri: 'http://localhost:3000',
        scopes: ['https://mail.google.com/']
    }),
    //new AccountType('other', 'Other', 'Use IMAP, POP3, and SMTP to configure your account'),
]

module.exports = { AccountType, AccountTypes }