import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  standalone: false
})
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }
  // This is the function that will open the dialog when the signup button is clicked  
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }
  // This is the function that will open the dialog when the All Movies button is clicked
openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }
}