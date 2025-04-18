import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})

/**
 * Component for the user profile view.
 * It provides methods to fetch, edit, and delete user data.
 * It also fetches and displays favorite movies.
 */
export class ProfileViewComponent implements OnInit {
  userData: any = {};
  editForm: FormGroup;
  isEditing: boolean = false;
  favoriteMovies: any[] = []; // Store full movie details
  isLoading: boolean = true; // Track loading state

  constructor(
    private fetchApiDataService: FetchApiDataService,   
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.formBuilder.group({
      Username: [''],
      Password: [''],
      Email: [''],
      Birthday: [''],
    });
  }

  ngOnInit(): void {
    this.fetchApiDataService.getAllMovies().subscribe((resp: any) => {
      this.userData = resp;
      // console.log('User data:', this.userData); // Debug user data
      // Once user data is loaded, fetch and filter favorite movies
      this.loadFavoriteMovies();
    });
  }
  openHome(): void {
    window.location.href = '/movies';
  }
  userLogout(): void {

    // Clear token from local storage
    localStorage.removeItem('token');
    // Navigate to the welcome page
    window.location.href = '/welcome';
  }
  showGenre(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
        data: {
            title: String(movie.genre.name).toUpperCase(),
            content: movie.genre.description
        },
        width: "30%"
    })
  }
  showDirector(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
        data: {
            title: String(movie.director.name).toUpperCase(),
            content: movie.director.bio
        },
        width: "30%"
    })
  }
  showDetail(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
        data: {
            title: movie.title,
            content: movie.description
        },
        width: "30%"
    })
  }
  /**
   * Fetches user data and favorite movies.
   */
  getUserData(): void {
    this.fetchApiDataService.getAllMovies().subscribe((resp: any) => {
      this.userData = resp;
      // console.log(this.userData);
      // console.log('FavoriteMovies (IDs):', this.userData.FavoriteMovies);

      if (this.userData.FavoriteMovies?.length > 0) {
        this.loadFavoriteMovies();
      } else {
        this.isLoading = false; // Set loading to false if no favorite movies
      }

      this.editForm.patchValue({
        Username: this.userData.Username,
        Email: this.userData.Email,
        Birthday: this.userData.Birthday,
      });
    });
  }

  /**
   * Enables editing of user data.
   */
  enableEdit(): void {
    this.isEditing = true;
  }

  /**
   * Saves changes to user data.
   */
  saveChanges(): void {
    /*if (this.editForm.valid) {
      this.editUserService
        .editUser(this.editForm.value)
        .subscribe((resp: any) => {
          // console.log(resp);
          this.isEditing = false;
          this.getUserData();
        });
    }*/
  }

  /**
   * Cancels editing of user data.
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.patchValue({
      Username: this.userData.Username,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday,
    });
  }

  /**
   * Confirms and deletes the user profile.
   * If confirmed, the deleteProfile method is called.
   * If canceled, the dialog is closed.
   */
  /*confirmDelete(): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete your profile? This action is irreversible.'
    );
    if (confirmDelete) {
      this.deleteProfile();
    }
  }*/

  /**
   * Deletes the user profile.
   * On success, the user is logged out and redirected to the login or home page.
   */
  /*deleteProfile(): void {
    this.deleteUserService.deleteUser().subscribe(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your profile has been deleted.');
        window.location.href = '/login'; // Redirect to login or home page
      }
      // (err) => console.error('Error deleting profile', err)
    );
  }*/

  /**
   * Fetches and filters favorite movies.
   * The favoriteMovies array is populated with full movie details.
   */
  loadFavoriteMovies(): void {
    this.fetchApiDataService.getAllMovies().subscribe(
      (movies: any[]) => {
        // console.log('All movies:', movies); // Debug all movies fetched
        this.favoriteMovies = movies.filter((movie) =>
          this.userData.FavoriteMovies.includes(movie._id)
        );
        // console.log('Filtered favoriteMovies:', this.favoriteMovies); // Debug favorites
        this.isLoading = false; // Loading complete
      },
      (err: any) => {
        // console.error('Error fetching all movies:', err);
        this.isLoading = false; // Ensure loading state is false on error
      }
    );
  }

  /**
   * Opens a dialog for a movie, which displays movie details.
   * @param type - The type of dialog to open.
   * @param data - The movie data to display in the dialog.
   */
  openDialog(type: string, data: any): void {
    // console.log('Dialog Type:', type);
    // console.log('Dialog Data:', data);
    this.dialog.open(MessageBoxComponent, {
      data: { type, data },
      width: '400px',
    });
  }

  /**
   * Removes a movie from favorites.
   * @param movie - The movie to remove.
   */
  /*removeFavorite(movie: any): void {
    this.removeFromFavoritesService.removeFromFavorites(movie._id).subscribe(
      () => {
        // console.log(`${movie.Title} removed from favorites.`);
        this.favoriteMovies = this.favoriteMovies.filter(
          (favMovie) => favMovie._id !== movie._id
        ); // Correctly update the UI
        this.snackBar.open(`${movie.Title} removed from favorites.`, 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        // console.error(`Error removing ${movie.Title} from favorites:`, error);
        this.snackBar.open(
          `Could not remove ${movie.Title} from favorites.`,
          'OK',
          { duration: 3000 }
        );
      }
    );
  }*/
}