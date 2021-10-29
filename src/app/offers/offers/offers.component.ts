import { CookieService } from 'ngx-cookie-service';
import { Offer } from './../../models/offer.model';
import { OffersService } from './../../shared/services/offers.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  eligible_offers: Offer[];
  not_eligible_offers: Offer[];

  constructor(
    private offersService: OffersService,
    private cookieService: CookieService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const userId = this.cookieService.get('user_uid');
    this.route.queryParams.subscribe(params => {
      this.offersService.getOffers(userId, params).subscribe(offers => {
        this.eligible_offers = offers.eligible;
        this.not_eligible_offers = offers.not_eligible;
      });
    });
  }
}
