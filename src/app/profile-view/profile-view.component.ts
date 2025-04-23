import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment'; // Import moment for date formatting
import { Router } from '@angular/router';

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
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      Username: [''],
      Password: [''],
      Email: [''],
      Birthday: [''],
    });
  }

  /**
   *  Initializes the component.
   *  This method is called when the component is created.
   * @returns void
   */
  ngOnInit(): void {
    const user = localStorage.getItem("user");
    let username = user ? JSON.parse(user).Username : null;
    if (!username) {
      console.error("Username not found in localStorage.");
      return;
    }
    this.fetchApiDataService.getUser(username).subscribe((resp: any) => {     
      //console.log('User data fetched:', resp);        
      this.userData = resp;       
      // Once user data is loaded, fetch and filter favorite movies
      this.loadFavoriteMovies();
    });
  }
  /**
   * Navigates to the home page (movies list).
   * This method is typically called when the user clicks on a home button or link.
   */
  openHome(): void {   
    this.router.navigate(['movies']);
  }
  /**
   * Logs out the user by clearing the token from local storage and navigating to the welcome page.
   */
  userLogout(): void {

    // Clear token from local storage
    localStorage.removeItem('token');
    // Navigate to the welcome page    
    this.router.navigate(['welcome']);
  }
  /**
   * Opens a dialog to show the genre of a movie.
   * @param movie The movie object containing genre information.
   */
  showGenre(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
        data: {
            title: String(movie.genre.name).toUpperCase(),
            content: movie.genre.description
        },
        width: "30%"
    })
  }
  /**
   * Opens a dialog to show the director of a movie.
   * @param movie - The movie object containing director information
   * @returns void
   */
  showDirector(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
        data: {
            title: String(movie.director.name).toUpperCase(),
            content: movie.director.bio
        },
        width: "30%"
    })
  }

  /**
   * Opens a dialog to show the details of a movie.
   * @param movie The movie JSON object containing details to display.     
   * @returns void
   */
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
   * Fetches user data and favorite movies and populates the userData object.
   * This method is called when the component initializes.
   * It retrieves the user's profile information and favorite movies from the API.
   *  @param {void}  No parameters are required for this method.
   *  @returns {void}  This method does not return any value.
   */
  getUserData(): void {
    this.fetchApiDataService.getAllMovies().subscribe((resp: any) => {
      console.log('User data:', resp);
      this.userData = resp;      
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
  
  enableEdit(): void {
    this.isEditing = true;
  }

  /**
   * Save changes in the edit form to the database.
   * This method is called when the user submits the edit form.
   * It validates the form, retrieves the username from local storage,
   * and sends the updated user data to the API.
   * @param {void} - No parameters are required for this method.
   * @returns {void} - This method does not return any value.
   */
  saveChanges(): void {
    if (this.editForm.valid) {
      const user = localStorage.getItem("user");
      let username = user ? JSON.parse(user).Username : null;
      if (!username) {
        console.error("Username not found in localStorage.");
        return;
      }      
      this.fetchApiDataService
          .editUser(username,JSON.stringify(this.editForm.value))
          .subscribe((resp: any) => {
            //console.log(resp);
            this.isEditing = false;            
            this.router.navigate(['profile']);
          });
      }
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
   * Confirms and deletes the user profile from the database.
   * If confirmed, the deleteProfile method is called.
   * If canceled, the dialog is closed.
   */
  confirmDelete(): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete your profile? This action is irreversible.'
    );
    if (confirmDelete) {
      this.deleteProfile();
    }
  }

  /**
   * Deletes the user profile.
   * On success, the user is logged out and redirected to the login or home page.
   * @param {void} - No parameters are required for this method.
   * @returns {void} - This method does not return any value.
   */
  deleteProfile(): void {
    const user = localStorage.getItem("user");
    let username = user ? JSON.parse(user).Username : null;
    if (!username) {
      console.error("Username not found in localStorage.");
      return;
    }
    this.fetchApiDataService.deleteUser(username).subscribe(
      (resp: any) => {               
      }      
    );
    localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your profile has been deleted.');        
        this.router.navigate(['welcome']);
  }

  /**
   * Fetches and filters users favorite movies.
   * The favoriteMovies array is populated with users favorite movie id's.
   *  @param {void} - No parameters are required for this method.
   *  @returns {void} - This method does not return any value.
   */
  loadFavoriteMovies(): void {
    const user = localStorage.getItem("user");
    let username = user ? JSON.parse(user).Username : null;
    if (!username) {
      console.error("Username not found in localStorage.");
      return;
    }
    this.fetchApiDataService.getUserFavorites(username).subscribe((resp: any) => {      
      //this.favoriteMovies = resp.FavoriteMovies || [];
      //console.log('Favorite Movies:', this.favoriteMovies);
      
      let favoriteMoviesList = resp.FavoriteMovies || [];      

      this.fetchApiDataService.getAllMovies().subscribe((movies: any) => {

        this.favoriteMovies = movies.filter((movie: any) =>           
          favoriteMoviesList.some((fav: any) => {            
            return String(fav) === String(movie._id)})
        );        
        this.isLoading = false; // Loading complete
      });      
    });    
  }

  /**
   * Unused method
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
   * This method updates the favoriteMovies array to reflect the removal of the movie.
   * @param movie - The movie JSON object.
   * @returns {void} - This method does not return any value.   
   */
  removeFavorite(movie: any): void {
    const user = localStorage.getItem("user");
    let username = user ? JSON.parse(user).Username : null;
    if (!username) {
      console.error("Username not found in localStorage.");
      return;
    }
    this.fetchApiDataService.removeMovieFromFavorites(username,movie._id).subscribe(
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
  }
}