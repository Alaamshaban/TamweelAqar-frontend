import { MatSnackBar } from '@angular/material/snack-bar';
import { OffersService } from './../../shared/services/offers.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/shared/components/validators/confirm-password.validator';
import { UserService } from 'src/app/shared/services/user.service';
import NationaltiesJSON from '../../../assets/json/nationalities.json';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;
  nationalities = NationaltiesJSON;
  userResults;
  loading = true;

  constructor(
    private userService: UserService,
    private offersService: OffersService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setUserForm();
    this.getUser();
    this.userService.getUserHistory().subscribe((res:[]) => {
      console.log(res);
      this.userResults = res;
      this.offersService.lastSearchResults=res;
    });
  }

  getUser() {
    this.userService.getUser().subscribe(res => {
      this.loading = false;
      console.log(res);
      this.patchForm(res);
    })
  }

  setUserForm() {
    this.userForm = this.fb.group({
      user_name: [null],
      phone_number: [null, Validators.required],
      email_address: [null],
      password: [null, Validators.minLength(6)],
      confirm_password: [''],
      full_name: [null, Validators.required],
      gender: [null],
      date_of_birth: [null],
      address: [null],
      nationality: [null],
      employment_status: [null]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });
  }

  patchForm(user) {
    this.userForm.patchValue({
      user_name: user.user_name === 'null' ? '' : user.user_name,
      phone_number: user.phone_number,
      email_address: user.email_address === 'null' ? '' : user.email_address,
      password: user.password === 'null' ? null : user.password,
      confirm_password: user.password === 'null' ? null : user.password,
      full_name: user.full_name === 'null' ? '' : user.full_name,
      gender: user.gender,
      date_of_birth: user.date_of_birth === 'null' ? null : user.date_of_birth,
      address: user.address === 'null' ? '' : user.address,
      nationality: JSON.parse(user.nationality),
      employment_status: user.employment_status
    });
  }

  get f() {
    return this.userForm.controls;
  }

  public compareWith(object1: any, object2: any) {
    return object1 && object2 && object1.num_code === object2.num_code;
  }

  saveUser() {
    this.loading = true;
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      const user = firebase.auth().currentUser;
      if (user) {
        this.updateUserEmailAndPass()
      } else {
        firebase.auth().onAuthStateChanged((user) => {
          console.log(user);
          this.updateUserEmailAndPass();
        });
      }
    }, err => {
      console.log(err);
      this.loading = false;
      this.snackBar.open(err.Error, '', {
        duration: 30000,
      });
    });
  }

  updateUserEmailAndPass() {
    firebase.auth().currentUser.updateEmail(this.userForm.value.email_address)
      .then((result) => {
        firebase.auth().currentUser.updatePassword(this.userForm.value.password).then(result => {
          this.loading = false;
        }, (err: firebase.auth.Error) => {
          console.log(err);
          this.loading = false;
          this.snackBar.open(err.message, '', {
            duration: 30000,
          });
        });
      }, (err: firebase.auth.Error) => {
        console.log(err);
        this.loading = false;
        this.snackBar.open(err.message, '', {
          duration: 30000,
        });
      });
  }

}
