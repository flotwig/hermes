import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { ipcRenderer } from 'electron';

@Injectable()
export class MicrosoftGraphService {
  private userInfo: any|null = null;

  authConfig = {

    // Url of the Identity Provider
    loginUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        + '?client_id=' + AppConfig.msGraphClientId
        + '&response_type=token'
        + '&nonce=1'
        + '&scope=email Mail.Read Mail.Read.Shared Mail.ReadWrite Mail.ReadWrite.Shared '
        + 'Mail.Send Mail.Send.Shared MailboxSettings.Read MailboxSettings.ReadWrite '
        + 'User.Read openid',
  
    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/',
  
    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: AppConfig.msGraphClientId,

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile email voucher'
  }

  constructor() { 

    
  }

  getLoginUrl() {
    return this.authConfig.loginUrl
  }

  signIn(username?: string) {

  }


  signOut() {

  }

}
