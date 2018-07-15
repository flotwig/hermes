import React, { Component } from 'react';
import { Card, CardTitle, CardText, Button } from 'reactstrap';
import request from 'request'
import './OAuth.css';

const {BrowserWindow, BrowserView} = window.require('electron').remote

export default class OAuth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            authUri: props.oauthParams.authUri,
            tokenUri: props.oauthParams.tokenUri,
            clientId: props.oauthParams.clientId,
            clientSecret: props.oauthParams.clientSecret,
            scope: props.oauthParams.scopes.join(' '),
            redirectUri: window.location.origin,
            loggingIn: false
        }
    }
    render() {
        return (
            <Card body outline color="primary" className="oauth mx-auto w-50">
                <CardTitle>{this.props.children}</CardTitle>
                <CardText>
                    {this.state.loggedIn ?
                        <span> <i className="mx-auto fas fa-check text-success"/>You've been logged in</span>
                    :
                        <span>
                            {this.state.loggingIn2 && !this.state.loggedIn && <span className="text-secondary">{this.state.loggingIn2 && <i className="mx-auto fas fa-sync-alt text-muted"/>}Authenticating...</span>}
                            {this.state.error && !this.state.loggedIn && <span className="text-warning"><i className="mx-auto fas fa-times text-danger"/>{this.state.error}</span>}
                            <Button color="primary" disabled={this.state.loggingIn} onClick={()=>this.tryLogin()}>Login</Button>
                        </span>
                    }
                </CardText>
            </Card>
        )
    }
    tryLogin() {
        this.setState({ loggingIn: true })
        let uri = this.state.authUri
            + '?client_id=' + this.state.clientId
            + '&scope=' + this.state.scope
            + '&response_type=code'
            + '&access_type=offline'
            + '&redirect_uri=' + this.state.redirectUri
        let win = new BrowserWindow({
            width: 480, 
            height: 640,
            autoHideMenuBar: true,
            title: 'Login'
        })
        win.on('closed', (e) => {
            this.setState({ loggingIn: false })
        })
        let bv = new BrowserView({})
        win.setBrowserView(bv)
        bv.webContents.on('did-finish-load', () => {
            let url = bv.webContents.getURL()
            if (url.includes('?error=')) {
                this.setState({ error: "Oauth error:" + url.split('?error=')[1] })
                win.close()
            } else if (url.includes('?code=')) {
                this.setState({ loggingInPart2: true })
                win.close()
                let code = url.split('?code=')[1]
                request.defaults({proxy:'http://proxy-src.research.ge.com:8080/'})
                request.post(this.state.tokenUri, {
                    form: {
                        code,
                        client_id: this.state.clientId,
                        client_secret: this.state.clientSecret,
                        redirect_uri: this.state.redirectUri,
                        grant_type: 'authorization_code'
                    }
                }, (err, res, body) => {
                    if (body) {
                        let res = JSON.parse(body)
                        this.setState({loggedIn: true})
                        this.props.onLogin(res)
                    } else {
                        this.setState({error: "error while getting token", loggingIn: false, loggingInPart2: false})
                    }
                })
            }
        })
        bv.setBounds({x:0,y:0,width:480,height:640})
        bv.webContents.loadURL(uri)
    }
}