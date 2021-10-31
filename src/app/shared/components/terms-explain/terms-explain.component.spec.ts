import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsExplainComponent } from './terms-explain.component';

describe('TermsExplainComponent', () => {
  let component: TermsExplainComponent;
  let fixture: ComponentFixture<TermsExplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsExplainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
