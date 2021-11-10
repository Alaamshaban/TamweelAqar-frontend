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

  constructor(
    private userService: UserService,
    private offersService: OffersService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log('hererer')
    this.setUserForm();
    this.getUser();
    this.userResults = this.offersService.userLastSearch
    console.log(this.offersService.userLastSearch);
  }

  getUser() {
    this.userService.getUser().subscribe(res => {
      console.log(res);
      this.patchForm(res);
    })
  }

  setUserForm() {
    this.userForm = this.fb.group({
      user_name: [null],
      phone_number: [null],
      email_address: [null],
      password: [null, Validators.minLength(6)],
      confirm_password: [''],
      full_name: [null],
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
      user_name: user.user_name,
      phone_number: user.phone_number,
      email_address: user.email_address === 'null' ? '' : user.email_address,
      password: user.password === 'null' ? null : user.password,
      confirm_password: user.password === 'null' ? null : user.password,
      full_name: user.full_name === 'null' ? '' : user.full_name,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      address: user.address,
      nationality: JSON.parse(user.nationality),
      employment_status: user.employment_status
    });
    console.log(this.userForm.errors)
  }

  get f() {
    return this.userForm.controls;
  }

  public compareWith(object1: any, object2: any) {
    return object1 && object2 && object1.num_code === object2.num_code;
  }

  saveUser() {
    console.log(this.userForm.value);
    this.userService.updateUser(this.userForm.value).subscribe(res => {
      setTimeout(() => {
        firebase.auth().currentUser.updateEmail(this.userForm.value.email_address)
          .then((result) => {
            firebase.auth().onAuthStateChanged((user) => {
              console.log(user)
              firebase.auth().currentUser.updatePassword(this.userForm.value.password).then(result => {
                console.log('result?>>>>>', result)
              })
            })

            console.log('result?>>>>>', result)
          })
      }, 2000)

    })
  }

}
