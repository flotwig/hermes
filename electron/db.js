const sqlite3 = require('sqlite3');
const fs = require('fs');
const mkdirp = require('mkdirp')

const DB_DIR = process.env.HOME + '/.config/hermes/';
const DB_FILE = 'hermes.db';
const DB_PATH = process.env.HERMES_DB || (DB_DIR + DB_FILE);

var Db = {}

Db._init = () => {
    let installed = fs.existsSync(DB_PATH)
    if (!installed) {
        mkdirp.sync(DB_DIR);
        Db._install();
    }
    Db.conn = new sqlite3.Database(DB_PATH)
}

Db._install = () => {
    let conn = new sqlite3.Database(DB_PATH)
    let schema = fs.readFileSync(__dirname+'/schema.sql').toString()
    conn.exec(schema)
    conn.close()
}



/**
 * Adds a $ to all keys on the object, to make SQLite accept it as var replacement
 * @param {Object} obj 
 * @param {string} keep Keys on the original object to keep
 */
function _objArgs(obj, ...keep) {
    var out = {}
    Object.keys(obj)
        .filter(x => keep.includes(x))
        .forEach(key => {
            out['$' + key] = obj[key]
        });
    return out
}

Db.insertAccount = (account, cb) => {
    Db.conn.run("\
        INSERT INTO accounts \
        (accountTypeId, addedOn, accessToken, refreshToken, expiresAt) \
        VALUES \
        ($accountTypeId, DATETIME('now'), $accessToken, $refreshToken, $expiresAt);\
    ", _objArgs(account, 'accountTypeId', 'accessToken', 'refreshToken', 'expiresAt'), cb)
}

Db.insertFolder = (folder, cb) => {
    if (!folder.parentId) folder.parentId = undefined;
    Db.conn.run("\
        INSERT INTO folders \
        (name, accountId, parentId, lastSynced, remoteRef, shouldSync) \
        VALUES \
        ($name, $accountId, $parentId, $lastSynced, $remoteRef, $shouldSync);\
    ", _objArgs(folder, 'name', 'accountId', 'parentId', 'lastSynced', 'remoteRef', 'shouldSync'), cb)
}

Db.insertMessage = (message, cb) => {
    Db.conn.run("\
        INSERT INTO messages \
        (folderId, subject, fromAddress, toAddress, addedOn, receivedOn, remoteRef, snippet) \
        VALUES \
        ($folderId, $subject, $fromAddress, $toAddress, DATETIME('now'), $receivedOn, $remoteRef, $snippet);\
    ", _objArgs(message, 'folderId', 'subject', 'fromAddress', 'toAddress', 'receivedOn', 'remoteRef', 'snippet'), cb)
}

Db.insertMessagePart = (messagePart, cb) => {
    Db.conn.run("\
        INSERT INTO messageParts \
        (messageId, partId, body, contentType, contentEncoding) \
        VALUES \
        ($messageId, $partId, $body, $contentType, $contentEncoding);\
    ", _objArgs(messagePart, 'messageId', 'partId', 'body', 'contentType', 'contentEncoding'), cb);
}

Db.selectFoldersForAccountId = (accountId, cb) => {
    Db.conn.all("SELECT * FROM folders WHERE accountId = ?;", [accountId], cb)
}

Db.selectMessageRemoteRefsForFolderId = (folderId, cb) => {
    Db.conn.all("SELECT remoteRef FROM messages WHERE folderId = ?", [folderId], cb)
}

Db.updateFolderNameById = (folderId, name, cb) => {
    Db.conn.run("UPDATE folders SET name = ? WHERE id = ?;", [name, folderId], cb)
}

Db.selectAccounts = (cb) => {
    Db.conn.all("SELECT * FROM accounts;", cb)
}

if (!Db.conn) {
    Db._init()
}

module.exports = Db