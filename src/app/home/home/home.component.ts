import { OffersService } from './../../shared/services/offers.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog,
    private offersService: OffersService) { }

  ngOnInit(): void {

  }

  calculateMoney() {
    const userId = this.cookieService.get('user_uid');
    this.offersService.getOffers(userId).subscribe(offers => {
      console.log(offers);
    }, (error: HttpErrorResponse) => {
      console.log('err>>', error);
      if (error.status === 401) {
        this.dialog.open(SignUpComponent, {
          width: '300px'
        });
      }
    })
  }

}
