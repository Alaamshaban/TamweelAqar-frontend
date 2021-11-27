import { Router } from '@angular/router';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnChanges {

  @Input() results;
  grouppedResults;

  constructor(private router: Router) { }

  ngOnChanges(): void {
    this.grouppedResults = this.groupBy(this.results, 'property_area');
    console.log(this.grouppedResults)
  }

  getGrouupedResultsKeys() {
    return Object.keys(this.grouppedResults)
  }

  groupBy = (array, key) => {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
      // If an array already present for key, push it to the array. Otherwise create an array and push the object.
      (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
      // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
      return result;
    }, {}); // Empty object is the initial value for result object
  };

  goToOffer(params) {
    console.log(params)
    this.router.navigate(['/offers'], {
      queryParams: {
        purchase_price: params.purchase_price,
        user_salary: params.user_salary,
        user_down_payment: params.user_down_payment,
        user_mortgage_term_length: params.user_mortgage_term_length,
        property_area: params.property_area
      }
    });
  }

}
