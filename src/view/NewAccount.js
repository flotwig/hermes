import React, { Component } from 'react';
import { GoogleOAuth } from './utility/OAuth';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';
import { AccountTypes } from '../model/AccountType';
import moment from 'moment'

export default class NewAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountType: undefined,
            isOpen: true,
            stepIndex: 0,
            stepComplete: []
        }
    }
    render() {
        let toggle = ()=>this.setState({isOpen:!this.state.isOpen});
        let stepComplete = [
            this.state.accountType !== undefined,
            this.state.accessToken !== undefined
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
                                            onClick={()=>this.setState({accountType})}
                                            active={this.state.accountType && this.state.accountType.id === accountType.id}>
                                            <strong>{accountType.name}</strong><br/>
                                            {accountType.description}
                                        </ListGroupItem>
                                    )
                                }
                            </ListGroup>
                        </div>,
                        <div>
                            <GoogleOAuth onLogin={(token)=>{
                                this.setState({
                                    accessToken: token['access_token'],
                                    refreshToken: token['refresh_token'],
                                    expiresAt: moment().add(token['expires_in'], 'seconds')
                                })
                            }}/>
                        </div>
                    ][this.state.stepIndex]}
                </ModalBody>
                <ModalFooter>
                    <Button color="secoondary" disabled={this.state.stepIndex === 0} onClick={()=>this.step(-1)}>Previous Step</Button>{' '}
                    <Button color="primary" disabled={stepComplete[this.state.stepIndex] !== true} onClick={()=>this.step(1)}>Next Step</Button>
                </ModalFooter>
            </Modal>
        )
    }

    step(i) {
        this.setState({
            stepIndex: this.state.stepIndex + i
        })
    }
}