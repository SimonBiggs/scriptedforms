import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendComponent } from './trend.component';

describe('TrendComponent', () => {
  let component: TrendComponent;
  let fixture: ComponentFixture<TrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
