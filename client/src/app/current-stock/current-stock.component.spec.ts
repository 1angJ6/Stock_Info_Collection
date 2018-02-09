import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStockComponent } from './current-stock.component';

describe('CurrentStockComponent', () => {
  let component: CurrentStockComponent;
  let fixture: ComponentFixture<CurrentStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
