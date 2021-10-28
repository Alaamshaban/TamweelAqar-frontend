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
    private dialog: MatDialog,
    private offersService: OffersService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    const userId = this.cookieService.get('user_uid');
    this.offersService.getOffers(userId).subscribe(offers => {
      console.log(offers);
      this.offers = offers;
    }, (error: HttpErrorResponse) => {
      console.log('err>>', error);
      if (error.status === 401) {
        this.dialog.open(SignUpComponent, {
          width: '300px',
          data: {
            process: 'signIn'
          }
        });
      }
    });
  }

}
