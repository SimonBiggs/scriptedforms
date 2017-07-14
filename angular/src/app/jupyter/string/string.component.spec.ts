import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringComponent } from './string.component';

describe('StringComponent', () => {
  let component: StringComponent;
  let fixture: ComponentFixture<StringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
