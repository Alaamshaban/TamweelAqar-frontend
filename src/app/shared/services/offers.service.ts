import { Offer } from './../../models/offer.model';

import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseURL } from 'src/app/base-url';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  getOffers(user_id: string): Observable<Offer[]> {
    const headers = {
      AuthToken: this.cookieService.get('token')
    }
    return this.http.get<Offer[]>(`${BaseURL}/api/users/${user_id}/offers`, { headers });

  }
}
