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
    this.setForm();
    if (this.searchParams) {
      this.patchForm();
    }
  }

  getMortgageLength() {
    return Array(30).fill(0).map((x, i) => i + 1)
  }


  setForm(): void {
    this.searchForm = this.fb.group({
      purchase_price: [null, Validators.required],
      user_salary: [null, Validators.required],
      down_payment: [null, Validators.required],
      mortgage_term_length: ['', Validators.required],
    });
  }

  patchForm(): void {
    console.log(this.searchParams)
    this.searchForm.patchValue({
      purchase_price: this.searchParams.purchase_price,
      user_salary: this.searchParams.user_salary,
      down_payment: this.searchParams.user_down_payment,
      mortgage_term_length: this.searchParams.user_mortgage_term_length
    });
  }

  search(): void {
    this.updateSearch.next(this.searchForm.value);

  }


  get f() {
    return this.searchForm.controls;
  }

}
