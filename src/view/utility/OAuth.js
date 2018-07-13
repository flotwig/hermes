import React, { Component } from 'react';
import { Card, CardTitle, CardText, Button } from 'reactstrap';
import request from 'request'
const {BrowserWindow, BrowserView} = window.require('electron').remote

export default class OAuth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            authUri: props.authUri,
            tokenUri: props.tokenUri,
            clientId: props.clientId,
            clientSecret: props.clientSecret,
            scope: props.scopes.join(' '),
            redirectUri: window.location.origin,
            loggingIn: false
        }
    }
    render() {
        return (
            <Card body outline color="primary" className="mx-auto w-50">
                {this.props.children}
                {this.state.loggedIn ?
                    <div>You've been logged in</div>
                :
                    <div>
                        {this.state.loggingIn2 && !this.state.loggedIn && <p className="text-secondary">Authenticating...</p>}
                        {this.state.error && !this.state.loggedIn && <p className="text-warning">{this.state.error}</p>}
                        <Button color="primary" disabled={this.state.loggingIn} onClick={()=>this.tryLogin()}>Login</Button>
                    </div>
                }
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
            height: 640
        })
        win.on('closed', (e) => {
            this.setState({ loggingIn: false })
        })
        let bv = new BrowserView({})
        win.setBrowserView(bv)
        win.setTitle('Login')
        bv.webContents.on('did-finish-load', () => {
            let url = bv.webContents.getURL()
            if (url.includes('?error')) {
                this.setState({ error: "Oauth error:" + url.split('?error=')[1] })
                win.close()
            } else if (url.includes('?code=')) {
                this.setState({ loggingInPart2: true })
                win.close()
                let code = url.split('?code=')[1]
                this.props.onAuth
                request.defaults({proxy:'http://proxy-src.research.ge.com:8080/'})
                var token = request.post(this.state.tokenUri, {
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
                    console.log(body)
                })
            }
        })
        bv.setBounds({x:0,y:0,width:480,height:640})
        bv.webContents.loadURL(uri)
    }
}

export class GoogleOAuth extends Component {
    render() {
        return (
            <OAuth authUri="https://accounts.google.com/o/oauth2/v2/auth"
                tokenUri="https://www.googleapis.com/oauth2/v4/token"
                clientId="730782245541-0ud5h4frebvr4r7tns0bmngb5l77lehc.apps.googleusercontent.com"
                clientSecret="CZtK77OEqPnf-0PtX5OXJXw5"
                scopes={['https://mail.google.com/']}
                onLogin={this.props.onLogin}>
                <CardTitle>Google Login</CardTitle>
                <CardText/>
            </OAuth> 
        )
    }
}