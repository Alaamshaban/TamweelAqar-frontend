import { SearchResultsComponent } from './components/search-results/search-results.component';
import { NavComponent } from './components/nav/nav.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { SearchComponent } from './components/search/search.component';
import { OffersContentComponent } from './components/offers-content/offers-content.component';
import { TermsExplainComponent } from './components/terms-explain/terms-explain.component';
import { SearchCardComponent } from './search-card/search-card.component';

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NiceSelectModule } from "ng-nice-select";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';








@NgModule({
  declarations: [
    NavComponent,
    PreloaderComponent,
    SearchComponent,
    OffersContentComponent,
    TermsExplainComponent,
    SearchCardComponent,
    SearchResultsComponent
  ],
  imports: [
    // modules
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatExpansionModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    FlexLayoutModule,
    NiceSelectModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  exports: [
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatExpansionModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NiceSelectModule,
    RouterModule,
    //components
    NavComponent,
    PreloaderComponent,
    SearchComponent,
    OffersContentComponent,
    TermsExplainComponent,
    SearchResultsComponent
  ]
})
export class SharedModule { }
