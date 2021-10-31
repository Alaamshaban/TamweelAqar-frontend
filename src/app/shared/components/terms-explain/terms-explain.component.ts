import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Offer } from 'src/app/models/offer.model';


@Component({
  selector: 'app-terms-explain',
  templateUrl: './terms-explain.component.html',
  styleUrls: ['./terms-explain.component.scss']
})
export class TermsExplainComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() offers: Offer[];

  constructor() { }

  ngOnInit(): void {
  }

  isDesktop() {
    return window.innerWidth >= 1200
  }

}
