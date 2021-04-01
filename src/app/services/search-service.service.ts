import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductResponse} from '../model/ProductResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private http: Http) { }


  searchForResults(searchQuery, domain): Observable<ProductResponse[]>{
    return this.http.get('http://localhost:8080/results?searchTerm='+searchQuery+'&domain='+domain)
      .pipe(map((response) => {
        return response.json().List;
      }));

  }
}
