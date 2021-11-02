import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Offers } from 'src/app/models/offer.model';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMMM Y',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() searchParams;
  @Input() offers: Offers;
  @Output() updateSearch = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  search(event): void {
    this.updateSearch.next(event);

  }

  isDesktop() {
    return window.innerWidth >= 1200
  }

}
