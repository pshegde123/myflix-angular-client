// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * UserRegistrationFormComponent is responsible for the new user registration.
 * It contains a form that collects the user's username, password, email, and birthday.
 * Upon submission, it sends the data to the backend for processing and displays a notification based on the result.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  standalone: false  
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
/**
 * This method is called when the user submits the registration form.
 * It uses the userRegistration() method from API to send the user data to the backend for registration.
 * @param userData - The data entered by the user in the registration form.
 * @returns void
 */
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
  // Logic for a successful user registration goes here! (To be implemented)
     this.dialogRef.close(); // This will close the modal on success!
     this.snackBar.open("Registration successful", 'OK', {
        duration: 2000
     });
    }, (result) => {
      this.snackBar.open("Registration failed", 'OK', {
        duration: 2000
      });
    });
  }

  }