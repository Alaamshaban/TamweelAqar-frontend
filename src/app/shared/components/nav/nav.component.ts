
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  signUp(){
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '300px'
    });
  }

}
