import { Injectable } from '@angular/core';
import { Jsonp, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import { StockDetails } from './stock-details';
import { Price } from './price';
import { Indicator } from './indicator';
import { History } from './history'

@Injectable()
export class StockService {

  private stockDetails: StockDetails;
  private price: Price;
  private sma: Indicator;
  private ema: Indicator;
  private stoch: Indicator;
  private rsi: Indicator;
  private adx: Indicator;
  private cci: Indicator;
  private bbands: Indicator;
  private macd: Indicator;
  private history: any;
  private news: any;

  private observable: Observable<any>;

  private currentSymbol: Observable<string>;

  constructor(private http: Http) { }

  getStockDetails(symbol:string, refresh:boolean) {
    if(this.stockDetails && !refresh) {
      return Observable.of(this.stockDetails);
    }
    else {
      this.observable = this.http.get("/api/stock_details/"+symbol)
      .map(response => {
        this.stockDetails = <StockDetails> response.json();
        return this.stockDetails;
      }).share();
      return this.observable;
    }
  }

  getPrice(symbol:string, refresh:boolean) {
    if(this.price && !refresh) {
      return Observable.of(this.price);
    }
    else {
      this.observable = this.http.get("/api/time_series_daily/"+symbol)
      .map(response => {
        this.price = <Price> response.json();
        return this.price;
      }).share();
      return this.observable;
    }
  }

  getSMA(symbol:string, refresh:boolean) {
    if(this.sma && !refresh) {
      return Observable.of(this.sma);
    }
    else {
      this.observable = this.http.get("/api/indicator/SMA/"+symbol)
      .map(response => {
        this.sma = <Indicator> response.json();
        return this.sma;
      }).share();
      return this.observable;
    }
  }

  getEMA(symbol:string, refresh:boolean) {
    if(this.ema && !refresh) {
      return Observable.of(this.ema);
    }
    else {
      this.observable = this.http.get("/api/indicator/EMA/"+symbol)
      .map(response => {
        this.ema = <Indicator> response.json();
        return this.ema;
      }).share();
      return this.observable;
    }
  }

  getSTOCH(symbol:string, refresh:boolean) {
    if(this.stoch && !refresh) {
      return Observable.of(this.stoch);
    }
    else {
      this.observable = this.http.get("/api/indicator/STOCH/"+symbol)
      .map(response => {
        this.stoch = <Indicator> response.json();
        return this.stoch;
      }).share();
      return this.observable;
    }
  }

  getRSI(symbol:string, refresh:boolean) {
    if(this.rsi && !refresh) {
      return Observable.of(this.rsi);
    }
    else {
      this.observable = this.http.get("/api/indicator/RSI/"+symbol)
      .map(response => {
        this.rsi = <Indicator> response.json();
        return this.rsi;
      }).share();
      return this.observable;
    }
  }

  getADX(symbol:string, refresh:boolean) {
    if(this.adx && !refresh) {
      return Observable.of(this.adx);
    }
    else {
      this.observable = this.http.get("/api/indicator/ADX/"+symbol)
      .map(response => {
        this.adx = <Indicator> response.json();
        return this.adx;
      }).share();
      return this.observable;
    }
  }

  getCCI(symbol:string, refresh:boolean) {
    if(this.cci && !refresh) {
      return Observable.of(this.cci);
    }
    else {
      this.observable = this.http.get("/api/indicator/CCI/"+symbol)
      .map(response => {
        this.cci = <Indicator> response.json();
        return this.cci;
      }).share();
      return this.observable;
    }
  }

  getBBANDS(symbol:string, refresh:boolean) {
    if(this.bbands && !refresh) {
      return Observable.of(this.bbands);
    }
    else {
      this.observable = this.http.get("/api/indicator/BBANDS/"+symbol)
      .map(response => {
        this.bbands = <Indicator> response.json();
        return this.bbands;
      }).share();
      return this.observable;
    }
  }

  getMACD(symbol:string, refresh:boolean) {
    if(this.macd && !refresh) {
      return Observable.of(this.macd);
    }
    else {
      this.observable = this.http.get("/api/indicator/MACD/"+symbol)
      .map(response => {
        this.macd = <Indicator> response.json();
        return this.macd;
      }).share();
      return this.observable;
    }
  }

  getHistoryValue(symbol:string, refresh:boolean) {
    if(this.history && !refresh) {
      return Observable.of(this.history);
    }
    else {
      this.observable = this.http.get("/api/history/"+symbol)
      .map(response => {
        this.history = response.json();
        return this.history;
      }).share();
      return this.observable;
    }
  }

  getNews(symbol:string, refresh:boolean) {
    if(this.news && !refresh) {
      return Observable.of(this.news);
    }
    else {
      this.observable = this.http.get("/api/news/"+symbol+"/amount/5/")
      .map(response => {
        this.news = response.json();
        return this.news;
      }).share();
      return this.observable;
    }
  }
}
