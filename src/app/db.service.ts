import { Injectable } from '@angular/core';
import { Sequelize } from 'sequelize';
import { Account } from './models/account';
import { Message } from './models/message';
import { AllElectron } from 'electron';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DbService {

  constructor() { 
    Electron.app.getPath('userData');
    
  }


}
