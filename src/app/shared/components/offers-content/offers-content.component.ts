import { Offer, Offers } from './../../../models/offer.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers-content',
  templateUrl: './offers-content.component.html',
  styleUrls: ['./offers-content.component.scss']
})
export class OffersContentComponent implements OnInit {

  @Input() offers: Offer[];
  @Input() searchParams;
  @Input() offersType: string;
  toggle: Boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
  getCompanyName(founder) {
    return JSON.parse(founder).founder_name
  }

  getCompanyLogo(founder) {
    return JSON.parse(founder).founder_logo
  }
  getCompanyPhone(founder) {
    return JSON.parse(founder).phone_number
  }
  getCompanyEmail(founder) {
    return JSON.parse(founder).email
  }
  getCompanyWebsite(founder) {
    window.open(JSON.parse(founder).website, "_blank");
  }

  getDownPayment(percentage) {
    console.log(percentage)
    return percentage / 100 * this.searchParams.purchase_price;
  }


}
