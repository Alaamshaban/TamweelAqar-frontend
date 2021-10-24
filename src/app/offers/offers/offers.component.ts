import { CookieService } from 'ngx-cookie-service';
import { Offer } from './../../models/offer.model';
import { OffersService } from './../../shared/services/offers.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  offers: Offer[];

  constructor(
    private router: Router) { }

  ngOnInit(): void {
    this.offers = history.state.data.offers;
    console.log(this.offers)
  }

}
