import { Injectable } from '@angular/core';
import { Jsonp, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import { Symbol } from './symbol';

@Injectable()
export class SymbolService {

  constructor(private jsonp: Jsonp, private http: Http) { }

  getSymbols(query: string) {
    let url = "/api/symbols/"+query;
    return this.http.get(url).map(response => <Symbol[]> response.json());
  }

}
