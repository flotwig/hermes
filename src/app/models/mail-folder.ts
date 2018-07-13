import {Table, Column, Model, DataType, AutoIncrement, BelongsTo } from 'sequelize-typescript';
import { Account } from './account'

@Table
export class MailFolder extends Model<MailFolder> {
    @Column(DataType.INTEGER)
    @AutoIncrement
    id: number;

    @BelongsTo(() => MailFolder)
    parent: MailFolder;

    @BelongsTo(() => Account)
    account: Account;

    @Column
    name: string;
}