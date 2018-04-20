import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePaneComponent } from './browse-pane.component';

describe('BrowsePaneComponent', () => {
  let component: BrowsePaneComponent;
  let fixture: ComponentFixture<BrowsePaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsePaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
