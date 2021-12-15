import { Offer, Offers } from './../../../models/offer.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-offers-content',
  templateUrl: './offers-content.component.html',
  styleUrls: ['./offers-content.component.scss']
})
export class OffersContentComponent implements OnInit {

  @Input() offers: Offer[];
  @Input() searchParams;
  @Input() offersType: string;
  @Output() onRevealOffer = new EventEmitter()
  toggle: Boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
  getCompanyName(founder) {
    return JSON.parse(founder).founder_name
  }

  getCompanyLogo(founder) {
    return JSON.parse(JSON.parse(founder)).founder_logo
  }
  getCompanyPhone(founder) {
    const phone = JSON.parse(JSON.parse(founder)).phone_number;
    window.open(`tel:${phone}`, "_blank");
  }
  getCompanyEmail(founder) {
    const email = JSON.parse(JSON.parse(founder)).email;
    window.open(`mailto: ${email}`, "_blank");
  }
  getCompanyWebsite(founder) {
    window.open(JSON.parse(JSON.parse(founder)).website, "_blank");
  }

  getDownPayment(percentage) {
    return percentage / 100 * this.searchParams.purchase_price;
  }

  revealOffer(type: string, offer) {
    switch (type) {
      case 'phone':
        this.getCompanyPhone(offer.founder);
        break;
      case 'web':
        this.getCompanyWebsite(offer.founder);
        break;
      case 'email':
        this.getCompanyEmail(offer.founder);
        break;
    }
    this.onRevealOffer.next({ offer: offer, revealed_by: type })
  }
}
