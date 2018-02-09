import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'app-historical-charts',
  templateUrl: './historical-charts.component.html',
  styleUrls: ['./historical-charts.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      state('*', style({opacity:'1'})),
      transition('void => *', [
        style({opacity:'0'}),
        animate(300)
      ]),
      
    ])
  ]
})
export class HistoricalChartsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoFavouriteList(): void {
    this.router.navigate(['/favouriteList']);
    // this.router.navigateByUrl('/favouriteList');
  }
}
