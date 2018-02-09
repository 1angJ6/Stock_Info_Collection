import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.css']
})
export class CurrentStockComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoFavouriteList(): void {
    this.router.navigate(['/favouriteList']);
    // this.router.navigateByUrl('/favouriteList');
  }

}
