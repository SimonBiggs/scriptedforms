import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableComponent } from './variable.component';

describe('VariableComponent', () => {
  let component: VariableComponent;
  let fixture: ComponentFixture<VariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
