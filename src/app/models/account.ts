import {Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Account extends Model<Account> {
    @Column
    name: string;

    @Column(DataType.ENUM('IMAP'))
    receiveServerType: string;

    @Column(DataType.INTEGER)
    receiveServerPort: number;

    @Column
    receiveServerHost: string;

    @Column
    receiveServerUsername: string;
    
    @Column
    receiveServerPassword: string;

    @Column(DataType.ENUM('NONE', 'TLS', 'STARTTLS'))
    receiveServerEncryption: string;

    @Column(DataType.ENUM('SMTP'))
    sendServerType: string;

    @Column(DataType.INTEGER)
    sendServerPort: number;

    @Column
    sendServerHost: string;

    @Column
    sendServerUsername: string;
    
    @Column
    sendServerPassword: string;

    @Column(DataType.ENUM('NONE', 'TLS', 'STARTTLS'))
    sendServerEncryption: string;
}