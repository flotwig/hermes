const Db = require('./db')
const syncModules = require('./sync/index')

const Sync = {
    syncing: {},
    init: () => {
        Db.selectAccounts((err, rows) => {
            if (!rows) return
            rows.forEach(account => {
                setTimeout(()=>Sync.beginSyncing(account), 1)
            });
        })
    },
    beginSyncing: (account) => {
        if (Sync.syncing[account.id] === true) return;
        Sync.syncing[account.id] = true
        let syncModule = new (Sync.getModuleForAccountType(account.accountTypeId))(account, Db)
        syncModule.sync(()=>{
            Sync.syncing[account.id] = false
        })
    },
    getModuleForAccountType: (accountTypeId) => {
        return syncModules[accountTypeId]
    }
}

module.exports = Sync