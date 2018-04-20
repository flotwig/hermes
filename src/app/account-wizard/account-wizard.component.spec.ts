import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWizardComponent } from './account-wizard.component';

describe('AccountWizardComponent', () => {
  let component: AccountWizardComponent;
  let fixture: ComponentFixture<AccountWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
