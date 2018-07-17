CREATE TABLE accounts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountTypeId TEXT NOT NULL,
    addedOn TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    expiresAt TEXT
);
CREATE TABLE folders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    accountId INTEGER NOT NULL,
    parentId INTEGER,
    lastSynced TEXT,
    remoteRef TEXT,
    shouldSync BOOLEAN,
    FOREIGN KEY(accountId) REFERENCES accounts(id),
    FOREIGN KEY(parentId) REFERENCES folders(id)
);
CREATE TABLE messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    folderId INTEGER NOT NULL,
    subject TEXT,
    fromAddresses TEXT,
    toAddresses TEXT,
    addedOn TEXT NOT NULL,
    receivedOn TEXT,
    snippet TEXT,
    bodyRaw TEXT,
    bodyText TEXT,
    remoteRef TEXT,
    FOREIGN KEY(folderId) REFERENCES folders(id)
);