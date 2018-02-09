import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { LazyRoutingModule } from './lazy-routing.module'

import { LazyModuleRootComponent } from './lazy-module-root.component';
import { CurrentStockComponent } from '../current-stock/current-stock.component';
import { HistoricalChartsComponent } from '../historical-charts/historical-charts.component';
import { NewsFeedsComponent } from '../news-feeds/news-feeds.component';

const routes: Routes = [
    { path: 'currentStock', component: CurrentStockComponent },
    { path: 'historicalCharts', component: HistoricalChartsComponent },
    { path: 'newsFeeds', component: NewsFeedsComponent }
  ];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [
        LazyModuleRootComponent,
        CurrentStockComponent,
        HistoricalChartsComponent,
        NewsFeedsComponent 
    ]
})

export class LazyModule {}