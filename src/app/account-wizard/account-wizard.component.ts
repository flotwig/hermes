import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'account-wizard',
  templateUrl: './account-wizard.component.html',
  styleUrls: ['./account-wizard.component.scss']
})
export class AccountWizardComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }

}
