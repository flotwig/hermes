import { Component, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';
import { BrowsePaneComponent } from './browse-pane/browse-pane.component';
import { DisplayPaneComponent } from './display-pane/display-pane.component';
import { AccountWizardComponent } from './account-wizard/account-wizard.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  entryComponents: [AccountWizardComponent]
})
export class AppComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(public electronService: ElectronService,
    private translate: TranslateService,
    private modalService: BsModalService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    this.bsModalRef = this.modalService.show(AccountWizardComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
