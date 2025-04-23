import { Component, OnInit, inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { Router } from '@angular/router';

/**
 * Component for the movie card, which displays movie details.
 * It fetches all movies from the database and displays them in cards.
 * It also allows users to add and remove movies from their favorites.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: false
})
export class MovieCardComponent {
  movies: any[] = [];
  favoriteMovies: string[] = []; // Store IDs of favorited movies
  breakpoint:number = 1;
  readonly dialog = inject(MatDialog);
 
  
  constructor(public fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar) { 
     
  }

ngOnInit(): void {
  this.getMovies();
  this.getFavoriteMovies(); // Fetch favorites on initialization
  this.breakpoint = (window.innerWidth <= 1200) ? 1 : 5;
}
onResize(event:any) {
  this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 5;
}

/**
   * Display selected movies genre details in a dialog box.
   * @param {any} movie - The JSON movie object.
   * @returns {void} 
   */
showGenre(movie: any): void {
  this.dialog.open(MessageBoxComponent, {
      data: {
          title: String(movie.genre.name).toUpperCase(),
          content: movie.genre.description
      },
      width: "40%"
  })
}

/**
   * Display selected movies director details in a dialog box.
   * @param {any} movie - The JSON movie object
   * @returns {void} 
   */
showDirector(movie: any): void {
  this.dialog.open(MessageBoxComponent, {
      data: {
          title: String(movie.director.name).toUpperCase(),
          content: movie.director.bio
      },
      width: "40%"
  })
}
/**
   * Display selected movie description details in a dialog box.
   * @param {any} movie - The JSON movie object
   * @returns {void} 
   */
showDetail(movie: any): void {
  this.dialog.open(MessageBoxComponent, {
      data: {
          title: movie.title,
          content: movie.description
      },
      width: "40%"
  })
}
/**
   * Fetches the user's favorite movies from the database into the favoriteMovies array.
   * @returns {void} 
   */
getFavoriteMovies(): void {
  const user = localStorage.getItem("user");
  let username = user ? JSON.parse(user).Username : null;
  if (!username) {
    console.error("Username not found in localStorage.");
    return;
  }
  this.fetchApiData.getUserFavorites(username).subscribe((resp: any) => {
    this.favoriteMovies = resp.FavoriteMovies || [];
    //console.log('Favorite Movies:', this.favoriteMovies);
  });
}
/**
   * Checks if a movie is in the user's favorites.
   * @param {any} movie - The movie to check
   * @returns {boolean} Whether the movie is in favorites
   */
isFavorite(movie: any): boolean {
  return this.favoriteMovies.includes(movie._id);
}
/**
   * Toggles a movie's favorite status.
   * If the movie is already a favorite, it is removed.
   * If the movie is not a favorite, it is added.
   * @param {any} movie - The movie to toggle
   * @returns {void} Updates the favoriteMovies array
   * @returns {void} Shows a snackbar notification
   */
toggleFavorite(movie: any): void {
  //console.log('Toggling favorite for movie:', movie);
  const user = localStorage.getItem("user");
  let username = user ? JSON.parse(user).Username : null;
  if (!username) {
    console.error("Username not found in localStorage.");
    return;
  }

  if (this.isFavorite(movie)) {
    // Remove from favorites
    this.fetchApiData.removeMovieFromFavorites(username,movie._id).subscribe(
      (resp) => {        
        //console.log(`${movie.Title} removed from favorites.`);
        this.favoriteMovies = this.favoriteMovies.filter(
          (id) => id !== movie._id
        ); // Update UI
        // Show a snackbar notification
        this.snackBar.open(`${movie.title} removed from favorites.`, 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error(`Error removing ${movie.title} from favorites:`, error);
        this.snackBar.open(
          `Could not remove ${movie.title} from favorites.`,
          'OK',
          {
            duration: 3000,
          }
        );
      }
    );
  } else {
    // Add to favorites    
    this.fetchApiData.addMovieToFavorites(username,movie._id).subscribe(
      () => {
        //console.log(`${movie.Title} added to favorites.`);
        this.favoriteMovies.push(movie._id); // Update UI
        // Show a snackbar notification
        this.snackBar.open(`${movie.title} added to favorites.`, 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error(`Error adding ${movie.Title} to favorites:`, error);
        this.snackBar.open(
          `Could not add ${movie.title} to favorites.`,
          'OK',
          {
            duration: 3000,
          }
        );
      }
    );
  }
}

/**
 * Logs out the user by removing the token from local storage
  * and navigating to the welcome page.
  * @returns {void} Navigates to the welcome page after logout
 */
userLogout(): void {

  // Clear token from local storage
  localStorage.removeItem('token');
  // Navigate to the welcome page  
  this.router.navigate(['welcome']);
}
/**
 * Navigates to the profile page.
 * * @returns {void} Navigates to the profile page
 */
openProfile(): void { 
  this.router.navigate(['profile']);
}

 /**
   * Fetches all movies from the database.
   * @returns {void} Movies array
   */
getMovies(): void { 
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      //console.log(this.movies);
      return this.movies;
    });
  }
}