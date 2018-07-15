import React, { Component } from 'react';
import OAuth from './utility/OAuth';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';
import { AccountTypes } from '../model/AccountType';
import moment from 'moment'
import { Account } from '../model/Account';
import { ApiConsumer } from '../Api';

export default class NewAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account: new Account({}),
            isOpen: true,
            stepIndex: 0,
            stepComplete: []
        }
    }
    render() {
        let a = this.state.account
        let toggle = ()=>this.setState({isOpen:!this.state.isOpen});
        let stepComplete = [
            a.accountTypeId !== '',
            a.accessToken !== '',
            true
        ]
        return (
            <Modal isOpen={this.state.isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>New Account</ModalHeader>
                <ModalBody>
                    {[
                        <div>
                            Select your account provider from the list below.
                            <ListGroup>
                                {
                                    AccountTypes.map((accountType) =>
                                        <ListGroupItem 
                                            action 
                                            key={accountType.id} 
                                            onClick={()=>this.changeAccount({accountTypeId: accountType.id})}
                                            active={a.accountTypeId === accountType.id}>
                                            <strong>{accountType.name}</strong><br/>
                                            {accountType.description}
                                        </ListGroupItem>
                                    )
                                }
                            </ListGroup>
                        </div>,
                        <div>
                            {a.accountTypeId && a.getAccountType() && a.getAccountType().oauthParams && <OAuth 
                                oauthParams={a.getAccountType().oauthParams}
                                onLogin={(token)=>{
                                    this.changeAccount({
                                        accessToken: token['access_token'],
                                        refreshToken: token['refresh_token'],
                                        expiresAt: moment().add(token['expires_in'], 'seconds')
                                    })
                                }}>{a.getAccountType().name} Auth</OAuth>}
                        </div>,
                        <div>
                            Congratulations! Your account is ready to be created. Click "Save" to exit this wizard and begin syncing from {a.accountTypeId && a.getAccountType().name}.
                        </div>
                    ][this.state.stepIndex]}
                </ModalBody>
                <ModalFooter>
                    <Button color="secoondary" disabled={this.state.stepIndex === 0} onClick={()=>this.step(-1)}>Previous Step</Button>{' '}
                    {this.state.stepIndex === 2 ?
                        <ApiConsumer>
                            {api => <Button color="success" onClick={()=>this.save(api)}>Save</Button>}
                        </ApiConsumer>
                        :
                        <Button color="primary" disabled={stepComplete[this.state.stepIndex] !== true} onClick={()=>this.step(1)}>Next Step</Button>
                    }
                </ModalFooter>
            </Modal>
        )
    }

    changeAccount(changes) {
        let account = Object.assign(new Account({}), this.state.account, changes)
        this.setState({account})
    }

    step(i) {
        this.setState({
            stepIndex: this.state.stepIndex + i
        })
    }

    save(api) {
        api.addAccount(this.state.account, (res, err) => {
            console.log(res, err)
        })
        this.setState({isOpen: false})
        if (this.props.onClose) this.props.onClose()
    }
}