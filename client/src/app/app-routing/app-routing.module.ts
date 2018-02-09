import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FavouriteListComponent } from '../favourite-list/favourite-list.component';
import { StockDetailsComponent } from '../stock-details/stock-details.component';
import { CurrentStockComponent } from '../current-stock/current-stock.component';
import { HistoricalChartsComponent } from '../historical-charts/historical-charts.component'
import { NewsFeedsComponent } from '../news-feeds/news-feeds.component';

const routes: Routes = [
  { path: '', redirectTo: 'favouriteList/0', pathMatch: 'full' },
  { path: 'favouriteList/:exist', component: FavouriteListComponent },
  { path: 'stockDetails/:symbol/:refresh', component: StockDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
