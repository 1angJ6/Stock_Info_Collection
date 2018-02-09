import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { SymbolService } from '../symbol.service';
import { Symbol } from '../symbol';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  symbols: Observable<Symbol[]>;
  private searchTermStream = new Subject<string>();
  searchGroup: FormGroup;

  constructor(private symbolService: SymbolService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.symbols = this.searchTermStream
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap((term: string) => this.symbolService.getSymbols(term));

    this.searchGroup = this.formBuilder.group({
      search: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]]
    });
  }

  onKeyUp() {
    if (this.searchGroup.valid) {
      this.searchTermStream.next(this.searchGroup.value.search);
    }
    else {
      this.searchTermStream.next("");
    }
  }

  getQuote() {
    let symbol = this.searchGroup.value.search;
    this.router.navigate(['/stockDetails/'+symbol+'/1']);
  }

  select(symbol: Symbol) {
    this.searchGroup.setValue({search:symbol.Symbol});
  }

  clear() {
    this.searchGroup.setValue({search:""});
    this.searchGroup.markAsUntouched();
    this.router.navigate(['/']);
  }

}
