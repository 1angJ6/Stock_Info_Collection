import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { ChartModule } from 'angular2-highcharts'
import { FacebookService, FacebookModule, InitParams } from 'ngx-facebook'
declare var jquery:any;
declare var $ :any;

import { StockService } from '../stock.service';

import { StockDetails } from '../stock-details';
import { Price } from '../price';
import { Indicator } from '../indicator';
import { History } from '../history'

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css'],
  animations: [
    trigger('slidingAnimation', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(50%)'}),
        animate(400)
      ]),
      
    ])
  ]
})
export class StockDetailsComponent implements OnInit {

  private mainNavState: string;
  private subNavState: string;
  private currentSymbol: string;
  private refresh: boolean;

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

  private priceChart: Object;
  private smaChart: Object;
  private emaChart: Object;
  private stochChart: Object;
  private rsiChart: Object;
  private adxChart: Object;
  private cciChart: Object;
  private bbandsChart: Object;
  private macdChart: Object;
  private historyChart: Object;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private stockService: StockService,
    private fb: FacebookService,
    private http: Http) { 
    this.mainNavState = "currentStock";
    this.subNavState = "price";
    let fbParams: InitParams = {
      appId: '1962947800652913',
      version: 'v2.10'
    };
    fb.init(fbParams);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentSymbol = params.get('symbol');
      this.refresh = params.get('refresh') === "1";

      this.stockService.getStockDetails(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.stockDetails = res;
        if(this.isFavoStockExist()) {
          this.setFavoStock();
        }
      });
      this.stockService.getPrice(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.price = res;
        if (!res.hasOwnProperty('error')){
          this.priceChart = this.priceChartGenerator(this.currentSymbol);
        }
      });
      this.stockService.getSMA(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.sma = res;
        if (!res.hasOwnProperty('error')){
          this.smaChart = this.IndicatorChartGenerator(this.currentSymbol, "Simple Moving Average", "SMA", this.sma);
        }
      });
      this.stockService.getEMA(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.ema = res;
        if (!res.hasOwnProperty('error')){
          this.emaChart = this.IndicatorChartGenerator(this.currentSymbol, "Exponential Moving Average", "EMA", this.ema);
        }
      });
      this.stockService.getSTOCH(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.stoch = res;
        if (!res.hasOwnProperty('error')){
          this.stochChart = this.IndicatorChartGenerator(this.currentSymbol, "Stochastic Oscillator", "STOCH", this.stoch);
        }
      });
      this.stockService.getRSI(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.rsi = res;
        if (!res.hasOwnProperty('error')){
          this.rsiChart = this.IndicatorChartGenerator(this.currentSymbol, "Relative Strength Index", "RSI", this.rsi);
        }
      });
      this.stockService.getADX(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.adx = res;
        if (!res.hasOwnProperty('error')){
          this.adxChart = this.IndicatorChartGenerator(this.currentSymbol, "Average Directional Movement idX", "ADX", this.adx);
        }
      });
      this.stockService.getCCI(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.cci = res;
        if (!res.hasOwnProperty('error')){
          this.cciChart = this.IndicatorChartGenerator(this.currentSymbol, "Commodity Channel Index", "CCI", this.cci);
        }
      });
      this.stockService.getBBANDS(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.bbands = res;
        if (!res.hasOwnProperty('error')){
          this.bbandsChart = this.IndicatorChartGenerator(this.currentSymbol, "Bollinger Bands", "BBANDS", this.bbands);
        }
      });
      this.stockService.getMACD(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.macd = res;
        if (!res.hasOwnProperty('error')) {
          this.macdChart = this.IndicatorChartGenerator(this.currentSymbol, "Moving Average Convergence/Divergence", "MACD", this.macd);
        }
      });
      this.stockService.getHistoryValue(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.history = res;
        if (!res.hasOwnProperty('error')){
          this.historyChart = this.historyChartGenerator(this.currentSymbol);
        }
      });
      this.stockService.getNews(this.currentSymbol,this.refresh).retry(2).subscribe(res => {
        this.news = res;
      });
    });

  }

  mainNavClick(activeNav:string) {
    this.mainNavState = activeNav;
    $('.mainNav').hide();
    $('#'+activeNav).fadeIn();
  }

  subNavClick(activeSubNav:string) {
    this.subNavState = activeSubNav;
    $('.subNav').hide();
    $('#'+activeSubNav).fadeIn();
  }

  hasError(data:Object) {
    return data.hasOwnProperty('error');
  }

  indicatorDataHasError() {
    switch(this.subNavState) {
      case "price":
        return this.price.hasOwnProperty('error');
      case "sma":
        return this.sma.hasOwnProperty('error');
      case "ema":
        return this.ema.hasOwnProperty('error');
      case "stoch":
        return this.stoch.hasOwnProperty('error');
      case "rsi":
        return this.rsi.hasOwnProperty('error');
      case "adx":
        return this.adx.hasOwnProperty('error');
      case "cci":
        return this.cci.hasOwnProperty('error');
      case "bbands":
        return this.bbands.hasOwnProperty('error');
      case "macd":
        return this.macd.hasOwnProperty('error');
    }
  }

  priceIncrease(change:string) {
    let c = parseFloat(change);
    return c > 0;
  }

  getcurrentChart(): Object {
    switch(this.subNavState) {
      case "price":
        return this.priceChart;
      case "sma":
        return this.smaChart;
      case "ema":
        return this.emaChart;
      case "stoch":
        return this.stochChart;
      case "rsi":
        return this.rsiChart;
      case "adx":
        return this.adxChart;
      case "cci":
        return this.cciChart;
      case "bbands":
        return this.bbandsChart;
      case "macd":
        return this.macdChart;
    }
  }

  currentChartloaded() {
    switch(this.subNavState) {
      case "price":
        return this.priceChart != null;
      case "sma":
        return this.smaChart != null;
      case "ema":
        return this.emaChart != null;
      case "stoch":
        return this.stochChart != null;
      case "rsi":
        return this.rsiChart != null;
      case "adx":
        return this.adxChart != null;
      case "cci":
        return this.cciChart != null;
      case "bbands":
        return this.bbandsChart != null;
      case "macd":
        return this.macdChart != null;
    }
  }

  shareImg() {
    this.http.post("/api/highchart/",this.getcurrentChart()).subscribe(res => {
      this.fb.ui({
        display: 'popup',
        app_id: '1962947800652913',
        method: 'feed',
        picture: res.text()
      }).then(
        (response) => {
          if(response && !response.error_message) {
            alert("Posted Successfully");
          } else {
            alert("Not Posted");
          }
        }
      ).catch(e => {alert("Not Posted");});
    });
  }

  setFavoStock() {
    localStorage.setItem(this.currentSymbol, JSON.stringify(this.stockDetails));
  }

  removeFavoStock() {
    localStorage.removeItem(this.currentSymbol);
  }

  isFavoStockExist(): Boolean {
    return (localStorage.getItem(this.currentSymbol) !== null);
  }

  priceChartGenerator(symbol:string): Object {
    let chart = {
      chart: {
        borderWidth: 2,
        borderColor: '#d2d2d2',
        type: 'line',
        zoomType: 'x'
      },
      title: {
        text: symbol+" Stock Price and Volume"
      },
      subtitle: {
        useHTML: true,
            text: '<a target="_blank" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
      },
      xAxis: {
        type: 'datetime',
            categories: this.price.date,
            tickInterval: 7
      },
      yAxis: [
        {
          labels: {
            format: '{value}'
          },
          title: {
            text: 'Stock Price'
          }
        },
        {
          labels: {
            formatter: function() {
              return (this.value / 1000000) + 'M';
            }
          },
          title: {
            text: 'Volume'
          },
          opposite: true
        }
      ],
      exporting: {
        enabled:true
      },
      series: [
        {
          name: "Price",
          type: 'area',
          yAxis: 0,
          data: this.price.close,
          color: '#0000ff',
          tooltip: {
            valueDecimals: 2
          }
        },
        {
          name: 'Volume',
          type: 'column',
          yAxis: 1,
          data: this.price.volume,
          color: '#ff0000',
          tooltip: {
            valueDecimals: 0
          }
        }
      ]
    };
    return chart;
  }

  IndicatorChartGenerator(symbol:string, full:string, short:string, indicator:Indicator): Object {
    let chart = {
      chart: {
        borderWidth: 2,
        borderColor: '#d2d2d2',
        type: 'line',
        zoomType: 'x'
      },
      tooltip: {
        valueDecimals: 4
      },
      title: {
        text: full+" ("+short+")"
      },
      subtitle: {
        useHTML: true,
            text: '<a target="_blank" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
      },
      xAxis: {
        type: 'datetime',
        categories: [],
        tickInterval: 7
      },
      yAxis: [
        {
          labels: {
            format: '{value}'
          },
          title: {
            text: short
          }
        }
      ],
      exporting: {
        enabled:true
      },
      series: [
      ]
    };
    chart.xAxis.categories = indicator.date;
    for(var i = 0; i < indicator.idxset.length; i++){
      var d = indicator.data[indicator.idxset[i]];
      chart.series.push({
        type: 'line',
        name: symbol + " " + indicator.idxset[i],
        data: d
      });
    }
    return chart;
  }

  historyChartGenerator(symbol:string): Object {
    let chart = {
      title: {
        text: symbol + ' Stock Value'
    },
    subtitle: {
      useHTML: true,
      text: '<a target="_blank" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
    },
    rangeSelector: {
      buttons: [{
        type: 'week',
        count: 1,
        text: '1w',
      },
      {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'month',
        count: 3,
        text: '3m'
      }, {
        type: 'month',
        count: 6,
        text: '6m'
      }, {
        type: 'ytd',
        text: 'YTD'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      selected: 0
    },
    yAxis: [
      {
        title: {
          text: "Stock Value"
        }
      }
    ],
    series: [{
      name: symbol+' Stock Price',
      data: this.history,
      type: 'areaspline',
      threshold: null,
      tooltip: {
          valueDecimals: 2
      }
    }]
    }

    return chart;
  }

  gotoFavouriteList(): void {
    this.router.navigate(['/favouriteList/1', {symbol: this.currentSymbol}]);
    // this.router.navigateByUrl('/favouriteList');
  }

}
