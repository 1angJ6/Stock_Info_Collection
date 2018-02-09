import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { trigger, state, animate, transition, style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
declare var jquery:any;
declare var $ :any;

import { StockService } from '../stock.service';

import { StockDetails } from '../stock-details';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.css'],
  animations: [
    trigger('slidingAnimation', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-50%)'}),
        animate(300)
      ]),
    ])
  ]
})
export class FavouriteListComponent implements OnInit {

  private exist: boolean;
  private existSymbol: string;
  private favoStocks: StockDetails[];
  private sortBy: string;
  private order: string;
  private auto;
  private timer: Observable<number>;
  private subscription;

  constructor(private router: Router,private activatedRoute: ActivatedRoute, private stockService: StockService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
   }

  ngOnInit() {
    $('#toggle').bootstrapToggle();
    let self = this;
    $('#toggle').change(function() {
      self.autoRefresh($(this).prop('checked'));
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.exist = params.get('exist') === '1';
      this.existSymbol = params.get('symbol');
    });
    this.favoStocks = this.getFavoStocks();
    this.timer = Observable.timer(0,5000);
  }

  getFavoStocks() {
    let res = [];
    for(var i = 0; i < localStorage.length; i++) {
      let stock = localStorage.getItem(localStorage.key(i));
      res.push(JSON.parse(stock));
    }
    return res;
  }

  removeStock(symbol:string) {
    localStorage.removeItem(symbol);
    this.favoStocks = this.getFavoStocks();
  }

  priceIncrease(change:string) {
    return parseFloat(change) > 0;
  }

  refreshFavo() {
    if(this.favoStocks) {
      for(var i = 0; i < localStorage.length; i++) {
        let stock = <StockDetails> JSON.parse(localStorage.getItem(localStorage.key(i)));
        this.stockService.getStockDetails(localStorage.key(i),true).subscribe(res => {
          if(!('error' in res)) {
            localStorage.setItem(res.stockTickerSymbol, JSON.stringify(res));
            this.favoStocks = this.getFavoStocks();
            this.sortList();
          }
        });
      }
    }
  }

  autoRefresh(open: boolean) {
    if(open) {
      this.subscription = this.timer.subscribe(t => {
        this.refreshFavo();
      });
    }
    else {
      this.subscription.unsubscribe();
    }
  }

  disableSelect() {
    return $('#sortBy').val() === "default";
  }

  sortList() {
    let sortBy = $('#sortBy').val();
    let order = $('#order').val();
    switch(sortBy) {
      case "symbol":
        if(order === "a") {
          this.favoStocks.sort(function(a, b) { return a.stockTickerSymbol > b.stockTickerSymbol?1:-1 });
        } else {
          this.favoStocks.sort(function(a, b) { return a.stockTickerSymbol > b.stockTickerSymbol?-1:1 });
        }
        break;
      case "price":
        if(order === "a") {
          this.favoStocks.sort(function(a, b){ return  parseFloat(a.close) - parseFloat(b.close) });
        } else {
          this.favoStocks.sort(function(a, b){ return  parseFloat(b.close) - parseFloat(a.close) });
        }
        break;
      case "change":
        if(order === "a") {
          this.favoStocks.sort(function(a, b){ return parseFloat(a.change) - parseFloat(b.change) });
        } else {
          this.favoStocks.sort(function(a, b){ return parseFloat(b.change) - parseFloat(a.change) });
        }
        break;
      case "changePercent":
        if(order === "a") {
          this.favoStocks.sort(function(a, b){ return parseFloat(a.changePercent) - parseFloat(b.changePercent) });
        } else {
          this.favoStocks.sort(function(a, b){ return parseFloat(b.changePercent) - parseFloat(a.changePercent) });
        }
        break;
      case "volume":
        if(order === "a") {
          this.favoStocks.sort(function(a, b){ return parseFloat(a.volume) - parseFloat(b.volume) });
        } else {
          this.favoStocks.sort(function(a, b){ return parseFloat(b.volume) - parseFloat(a.volume) });
        }
        break;
    }
  }

  gotoStockDetails(): void {
    this.router.navigate(['/stockDetails/'+this.existSymbol+"/0"]);
  }

}
