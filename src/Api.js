import React, { Component } from 'react';
import ApiActions from './ApiActions'

const {ipcRenderer} = window.require('electron')

const ApiContext = React.createContext()
export const ApiConsumer = ApiContext.Consumer

export default class Api extends Component {
    constructor(props) {
        super(props)
        this.callbacks = {}
        this.sequence = 0
    }
    componentDidMount() {
        ipcRenderer.on('api-response', (event, cbId, payload, error) => {
            let callback = this.callbacks[cbId]
            if (callback) {
                delete this.callbacks[cbId]
                callback(payload, error)
            }
        })
    }
    render() {
        return (
            <ApiContext.Provider value={this}>
                {this.props.children}
            </ApiContext.Provider>
        )
    }
    _send(actionId, payload, cb) {
        let cbId = ++this.sequence
        if (cb) this.callbacks[cbId] = cb
        ipcRenderer.send('api-request', cbId, actionId, payload)
    }
    addAccount(account, cb) {
        this._send(ApiActions.ADD_ACCOUNT, account.serialize(), cb)
    }
}