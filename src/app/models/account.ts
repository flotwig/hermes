import {Table, Column, Model} from 'sequelize-typescript';

@Table
export class Account extends Model<Account> {
    @Column
    name: string;
    
}