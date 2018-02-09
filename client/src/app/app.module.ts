import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatAutocompleteModule } from '@angular/material'
import { ChartModule } from 'angular2-highcharts'
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService'
import { FacebookModule } from 'ngx-facebook'

declare var require: any;
export function highchartsFactory() {
  //return require('highcharts');
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  const ex = require('highcharts/modules/exporting');
  const st = require('highcharts/modules/stock');

  dd(hc);
  ex(hc);
  st(hc);
  return hc;
}

import { AppRoutingModule } from './app-routing/app-routing.module'

import { SymbolService } from './symbol.service';
import { StockService } from './stock.service'

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FavouriteListComponent } from './favourite-list/favourite-list.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { HistoricalChartsComponent } from './historical-charts/historical-charts.component'
import { NewsFeedsComponent } from './news-feeds/news-feeds.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    FavouriteListComponent,
    StockDetailsComponent,
    CurrentStockComponent,
    HistoricalChartsComponent,
    NewsFeedsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    AppRoutingModule,
    ChartModule,
    FacebookModule.forRoot()
  ],
  providers: [SymbolService, StockService, { provide: HighchartsStatic, useFactory: highchartsFactory}],
  bootstrap: [AppComponent]
})
export class AppModule { }
