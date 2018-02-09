import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LazyModuleRootComponent } from './lazy-module-root.component';
import { CurrentStockComponent } from '../current-stock/current-stock.component';
import { HistoricalChartsComponent } from '../historical-charts/historical-charts.component';
import { NewsFeedsComponent } from '../news-feeds/news-feeds.component';

const routes: Routes = [
  { path: '', component: LazyModuleRootComponent,
    children: [
      { path: '', component: CurrentStockComponent },
      { path: 'historicalCharts', component: HistoricalChartsComponent },
      { path: 'newsFeeds', component: NewsFeedsComponent }
    ]
  },
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    declarations: [
    ],
    exports: [LazyRoutingModule]
  })

export class LazyRoutingModule {}