import { Offers } from './../../models/offer.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Cities from '../../../assets/json/cities.json';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss']
})
export class SearchCardComponent implements OnInit {

  searchForm: FormGroup;
  @Input() searchParams;
  @Input() offers: Offers;
  @Output() onSearch = new EventEmitter();

  cities = Cities;

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

  onChange(ev) {
    this.searchForm.controls['mortgage_term_length'].setValue(ev.target.value)
  }

  onChangePropertyArea(ev){
    this.searchForm.controls['property_area'].setValue(ev.target.value)
  }

  setForm(): void {
    this.searchForm = this.fb.group({
      purchase_price: [null, Validators.required],
      user_salary: [null, Validators.required],
      down_payment: [null, Validators.required],
      mortgage_term_length: ['', Validators.required],
      property_area: ['', Validators.required],
    });
  }

  MortgageLengthCompareFunction(o1: any, o2: any) {
    return (o1==o2);
   }

   propertyAreaCompareFunction(o1: any, o2: any) {
    return (o1 == o2);
   }


  patchForm(): void {
    console.log(this.searchParams)
    this.searchForm.patchValue({
      purchase_price: this.searchParams.purchase_price,
      user_salary: this.searchParams.user_salary,
      down_payment: this.searchParams.user_down_payment,
      mortgage_term_length: this.searchParams.user_mortgage_term_length,
      property_area:this.searchParams.property_area
    });
  }

  search(): void {
    this.onSearch.next(this.searchForm.value);

  }

  get f() {
    return this.searchForm.controls;
  }
}
