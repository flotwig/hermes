const sqlite3 = require('sqlite3');
const fs = require('fs');
const mkdirp = require('mkdirp')
const {app} = require('electron')

const DB_DIR = app.getPath('appData') + '/hermes/';
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
Db._objArgs = (obj, ...keep) => {
    var out = {}
    Object.keys(obj)
        .filter(x => keep.includes(x))
        .forEach(key => {
            out['$' + key] = obj[key]
        });
    return out
}

Db._genericInsert = (tableName, object, cb, ...keys) => {
    let query = "INSERT INTO "+tableName
        +" ("+keys.join(', ')+") "
        +"VALUES ("+keys.map(x=>x==='addedOn'?"DATETIME('now')":'$'+x)+');'
    Db.conn.run(query, Db._objArgs(object, ...keys.filter(x=>x!=='addedOn')), cb)
}

Db._genericUpdate = (tableName, object, cb) => {
    let keys = Object.keys(object).filter(k=>!['id','addedOn'].includes(k))
    let query = "UPDATE "+tableName+" SET "+keys.map(k=>k+' = $'+k).join(', ')+' WHERE id=$id;'
    Db.conn.run(query, Db._objArgs(object, 'id', ...keys), cb)
}

Db.insertAccount = (account, cb) => 
    Db._genericInsert('accounts', account, cb, 'accountTypeId', 'accessToken', 'refreshToken', 'expiresAt', 'addedOn')

Db.updateAccount = (account, cb) => 
    Db._genericUpdate('accounts', account, cb)

Db.insertFolder = (folder, cb) => {
    if (!folder.parentId) folder.parentId = undefined;
    Db._genericInsert('folders', folder, cb, 'name', 'accountId', 'parentId', 'lastSynced', 'remoteRef', 'shouldSync', 'addedOn')
}

Db.insertMessage = (message, cb) => 
    Db._genericInsert('messages', message, cb, 'folderId', 'subject', 'fromAddresses', 'unread', 'toAddresses', 'receivedOn', 'snippet', 'bodyRaw', 'bodyText', 'remoteRef', 'addedOn')

Db.selectFoldersForAccountId = (accountId, cb) => 
    Db.conn.all("SELECT * FROM folders WHERE accountId = ?;", [accountId], cb)

Db.selectMessageRemoteRefsForFolderId = (folderId, cb) => 
    Db.conn.all("SELECT remoteRef FROM messages WHERE folderId = ?", [folderId], cb)

Db.updateFolderNameById = (folderId, name, cb) => 
    Db.conn.run("UPDATE folders SET name = ? WHERE id = ?;", [name, folderId], cb)

Db.selectAccounts = (cb) => 
    Db.conn.all("SELECT * FROM accounts;", cb)

if (!Db.conn) {
    Db._init()
}

module.exports = Db