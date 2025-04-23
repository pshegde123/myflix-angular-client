import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * UserLoginFormComponent is responsible for the user login form functionality.
 * It allows users to input their credentials and submit them to the backend for authentication.
 */ 
@Component({
  selector: 'app-user-login-form',
  standalone: false,
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  //This is the function responsible for sending the form inputs to the backend
  /**
   * userLogin() is a method that handles user login by calling the FetchApiDataService's userLogin() method.
   * @param {void} - This method does not take any parameters.
   * @returns {void} - This method does not return any value.
   */
  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login goes here!
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.router.navigate(['movies']);
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open('Login successful', 'OK', {
          duration: 2000,
        });
        this.router.navigate(["movies"])
      },
      (result) => {
        this.snackBar.open('Login failed' + result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}