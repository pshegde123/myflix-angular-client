import { Component, OnInit, inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { Router } from '@angular/router';

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
  private snackBar!: MatSnackBar; // Inject MatSnackBar
  
  constructor(public fetchApiData: FetchApiDataService,private router: Router) { 
     
  }

ngOnInit(): void {
  this.getMovies();
  this.getFavoriteMovies(); // Fetch favorites on initialization
  this.breakpoint = (window.innerWidth <= 1200) ? 1 : 5;
}
onResize(event:any) {
  this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 5;
}
showGenre(movie: any): void {
  this.dialog.open(MessageBoxComponent, {
      data: {
          title: String(movie.genre.name).toUpperCase(),
          content: movie.genre.description
      },
      width: "40%"
  })
}
showDirector(movie: any): void {
  this.dialog.open(MessageBoxComponent, {
      data: {
          title: String(movie.director.name).toUpperCase(),
          content: movie.director.bio
      },
      width: "40%"
  })
}
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
   * Fetches the user's favorite movies from the database.
   * @returns {void} Favorite movies array
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
    console.log('Favorite Movies:', this.favoriteMovies);
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
  console.log('Toggling favorite for movie:', movie);
  const user = localStorage.getItem("user");
  let username = user ? JSON.parse(user).Username : null;
  if (!username) {
    console.error("Username not found in localStorage.");
    return;
  }

  if (this.isFavorite(movie)) {
    // Remove from favorites
    this.fetchApiData.removeMovieFromFavorites(username,movie._id).subscribe(
      () => {
        console.log(`${movie.Title} removed from favorites.`);
        this.favoriteMovies = this.favoriteMovies.filter(
          (id) => id !== movie._id
        ); // Update UI
        // Show a snackbar notification
        this.snackBar.open(`${movie.Title} removed from favorites.`, 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error(`Error removing ${movie.Title} from favorites:`, error);
        this.snackBar.open(
          `Could not remove ${movie.Title} from favorites.`,
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
        console.log(`${movie.Title} added to favorites.`);
        this.favoriteMovies.push(movie._id); // Update UI
        // Show a snackbar notification
        this.snackBar.open(`${movie.Title} added to favorites.`, 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error(`Error adding ${movie.Title} to favorites:`, error);
        this.snackBar.open(
          `Could not add ${movie.Title} to favorites.`,
          'OK',
          {
            duration: 3000,
          }
        );
      }
    );
  }
}
userLogout(): void {

  // Clear token from local storage
  localStorage.removeItem('token');
  // Navigate to the welcome page  
  this.router.navigate(['welcome']);
}
openProfile(): void { 
  this.router.navigate(['profile']);
}
getMovies(): void { 
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
}