import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  @Input() results;

  constructor() { }

  ngOnInit(): void {
  }


UniqueResults(){
  return this.results.filter((v,i,a)=>a.findIndex(t=>(t.params.property_area === v.params.property_area && t.params.purchase_price===v.params.purchase_price))===i)
}

}
