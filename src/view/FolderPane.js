import React, { Component } from 'react'
import { ApiConsumer } from '../Api'

export default class FolderPane extends Component {
    render() {
        return (
            <ApiConsumer>
                {({store}) => {
                    store.accounts.map((account) => {
                        return account.accountTypeId
                    })
                }}
            </ApiConsumer>
        )
    }
}