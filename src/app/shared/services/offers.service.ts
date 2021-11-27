import { UserService } from 'src/app/shared/services/user.service';
import { BaseURL } from '../../basURL';
import { Offer, Offers } from './../../models/offer.model';

import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  userLastSearch = new Array();
  baseUrl = BaseURL;
  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  getOffers(user_id: string, params): Observable<Offers> {
    const headers = {
      AuthToken: this.cookieService.get('token')
    }
    const { purchase_price, user_salary, user_down_payment, user_mortgage_term_length } = params;
    let offersParams = new HttpParams();
    offersParams = offersParams.set('purchase_price', purchase_price)
      .append('user_salary', user_salary)
      .append('user_down_payment', user_down_payment)
      .append('user_mortgage_term_length', user_mortgage_term_length)
    return this.http.get<Offers>(this.baseUrl + `/api/users/${user_id}/offers/`, { params: offersParams });

  }

  set lastSearchResults(history) {
    this.userLastSearch = history;
  }

  get lastSearchResults() {
    return this.userLastSearch;
  }
}
