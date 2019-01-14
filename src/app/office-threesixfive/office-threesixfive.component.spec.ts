import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeThreesixfiveComponent } from './office-threesixfive.component';

describe('OfficeThreesixfiveComponent', () => {
  let component: OfficeThreesixfiveComponent;
  let fixture: ComponentFixture<OfficeThreesixfiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeThreesixfiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeThreesixfiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
