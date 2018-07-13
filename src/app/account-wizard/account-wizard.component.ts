import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap';
import { MicrosoftGraphService } from '../services/microsoft-graph.service';

class AccountWizardField {
  label: string;
  helpText: string;
  type;
  options: string[];
  value: ''
  id: string;
  constructor(id, label, options?) {
    this.label = label;
    this.id = id;
    if (options) {
      this.helpText = options.helpText
      this.type = options.type
      this.value = options.value
    }
  }
}

class AccountWizardStep {
  name: string;
  fields: AccountWizardField[];
  valid?: boolean;
  validate: () => boolean
}

@Component({
  selector: 'account-wizard',
  templateUrl: './account-wizard.component.html',
  styleUrls: ['./account-wizard.component.scss']
})
export class AccountWizardComponent implements OnInit {
  stepI = 0
  steps: AccountWizardStep[] = [
    {
      name: 'Account Info',
      fields: [
        new AccountWizardField('name', 'Your Name', { helpText: 'The name that will be attached to this account and used for all outgoing email.'}),
        new AccountWizardField('email', 'Email Address', { type: 'email'})
      ],
      validate: () => {
        console.log(this)
        return true
      }
    },
    {
      name: 'Receive Setup',
      fields: [],
      validate: () => {
        
      }
    }
  ]

  constructor(public bsModalRef: BsModalRef,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  currentStep() {
    return this.steps[this.stepI]
  }

  tryChangeStep(to: AccountWizardStep) {
    if (to == this.currentStep()) return
    this.currentStep().valid = this.currentStep().validate()
    this.stepI = this.steps.findIndex(x => x == to)
  }

}
