import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { OffersService } from './../../shared/services/offers.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  offersForm: FormGroup;
  userId: string;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  app: any;
  confirmationResult: any;
  invalidPhoneNumberError: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private offersService: OffersService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.setOffersForm();

    this.userId = this.cookieService.get('user_uid');
    if (this.userId) {
      this.offersForm.controls['user_name'].clearValidators();
      this.offersForm.controls['phone_number'].clearValidators();
      this.offersForm.updateValueAndValidity();
    }
    this.app = firebase.initializeApp(environment.firebase);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'calculate-money',
      {
        size: 'invisible',
        callback: (token) => {
          if (token) {
            this.calculateMoney();
          }
        },
      }
    );
    this.recaptchaVerifier.render();

  }

  setOffersForm() {
    this.offersForm = this.fb.group({
      user_name: [null, Validators.required],
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]],
      purchase_price: [null],
      estimated_monthly: [null],
      down_payment: [null],
      property_ZIP_code: [null],
      mortgage_term_length: [null],
      email_address: [null]
    });
  }

  calculateMoney() {
    if (!this.userId) {
      const appVerifier = this.recaptchaVerifier;
      const num = '+20' + this.offersForm.value.phone_number;
      firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
        this.confirmationResult = result;
        this.dialog.open(SignUpComponent, {
          width: '300px',
          data: {
            process: 'verification',
            confirmation: this.confirmationResult
          }
        })
      }).catch(err => {
        this.offersForm.controls['phone_number'].setErrors({ invalid_field: true });
        this.invalidPhoneNumberError = err.message;

      });
    } else {
      this.router.navigate(['/offers']);
    }
  }
  get f() {
    return this.offersForm.controls;
  }

  ngOnDestroy() {
    this.app.delete();
  }
}
