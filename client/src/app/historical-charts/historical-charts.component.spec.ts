import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalChartsComponent } from './historical-charts.component';

describe('HistoricalChartsComponent', () => {
  let component: HistoricalChartsComponent;
  let fixture: ComponentFixture<HistoricalChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
