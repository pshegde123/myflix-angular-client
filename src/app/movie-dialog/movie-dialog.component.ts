import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-dialog',
  standalone: false,

  templateUrl: './movie-dialog.component.html',
  styleUrl: './movie-dialog.component.scss',
})

/**
 * Component for the movie dialog, which displays movie details.
 * It receives the type and data of the movie to display.
 * The type determines the dialog title and the data is the movie details.
 */
export class MovieDialogComponent {
  type: string | undefined;
  data: any;
  dialogTitle: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public injectedData: any) {
    console.log('Injected Data:', injectedData); // Debugging: Should log the injected data
    this.type = injectedData.type;
    this.data = injectedData.data;

    console.log('Type:', this.type); // Debugging: Check the type value
    console.log('Data:', this.data); // Debugging: Check the data value
  }
}