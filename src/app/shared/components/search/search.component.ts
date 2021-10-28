import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input() types$;
  @Input() searchParams;
  @Input() page: string;
  @Output() updateSearch = new EventEmitter();

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setForm();
    if (this.searchParams) {
      this.patchForm();
    }
  }

  setForm(): void {
    this.searchForm = this.fb.group({
      type: [null],
      created_at: [null],
      policy_category: [null],
      content_type: [null]
    });
  }

  patchForm(): void {
    this.searchForm.patchValue({
      type: this.searchParams.type,
      created_at: this.searchParams.created_at,
      policy_category: this.searchParams.policy_category,
      content_type: this.searchParams.content_type
    });
  }

  search(): void {
    let allIsNull = true;
    Object.keys(this.searchForm.value).forEach(key => {
      if (this.searchForm.value[key]) {
        allIsNull = false;
        return;
      }
    });
    if (!allIsNull) {
      this.searchForm.patchValue({
        content_type: 'RT'
      });
      if (this.searchForm.get('created_at').value) {
        this.searchForm.patchValue({
          created_at: this.searchForm.get('created_at').value.format('YYYY-MM-DD HH:mm:ss')
        });
      }
      this.updateSearch.next({ ...this.searchForm.value });
    } else {
      this.snackBar.open('Please select search data first!', '', {
        duration: 3000,
      });
    }

  }

}
