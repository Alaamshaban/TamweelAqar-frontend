import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing-module';



@NgModule({
  declarations: [LoginComponent,SignUpComponent, UserProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],

})
export class UserModule { }
