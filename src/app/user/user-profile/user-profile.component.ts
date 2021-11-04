import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/shared/components/validators/confirm-password.validator';
import { UserService } from 'src/app/shared/services/user.service';
import NationaltiesJSON from '../../../assets/nationalities.json';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;
  nationalities = NationaltiesJSON;

  constructor(
    private userService: UserService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setUserForm();
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(res => {
      console.log(res);
      this.patchForm(res);
    })
  }

  setUserForm() {
    this.userForm = this.fb.group({
      user_name: [null, Validators.required],
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]],
      email_address: [null, [Validators.email]],
      password: [null, Validators.required],
      confirm_password: ['', Validators.required],
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
      email_address: user.email_address,
      password: user.password,
      confirm_password: user.password,
      full_name: user.full_name,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      address: user.address,
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
    console.log(this.userForm.value);
    this.userService.updateUser(this.userForm.value).subscribe(res => console.log(res))
  }

}
