import { CookieService } from 'ngx-cookie-service';
import { Offer } from './../../models/offer.model';
import { OffersService } from './../../shared/services/offers.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  eligible_offers: Offer[];
  not_eligible_offers: Offer[];
  searchParams;
  userId = this.cookieService.get('user_uid');
  loading = true;

  constructor(
    private offersService: OffersService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router:Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      this.offersService.getOffers(this.userId, params).subscribe(offers => {
        this.loading = false;
        this.eligible_offers = offers.eligible;
        this.not_eligible_offers = offers.not_eligible;
        this.setUserHistory(params)
      });
    });
  }


  search(ev) {
    this.loading = true;
    this.router.navigate(['/offers'], {
      queryParams: {
        purchase_price: ev.purchase_price,
        user_salary: ev.user_salary,
        user_down_payment: ev.down_payment,
        user_mortgage_term_length: ev.mortgage_term_length
      }
    });
    this.setUserHistory(ev)
  }

  setUserHistory(params) {
    const index = this.offersService.userLastSearch.findIndex(r => r.params === params);
    this.offersService.userLastSearch[index] = {
      ...this.offersService.userLastSearch[index],
      eligible_offers: this.eligible_offers.length,
      not_eligible_offers: this.not_eligible_offers.length
    }
  }
}
