import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsExchangeComponent } from './ms-exchange.component';

describe('MsExchangeComponent', () => {
  let component: MsExchangeComponent;
  let fixture: ComponentFixture<MsExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
