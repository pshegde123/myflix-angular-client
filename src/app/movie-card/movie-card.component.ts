import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: false
})
export class MovieCardComponent {
  movies: any[] = [];
  breakpoint:number = 1;
  constructor(public fetchApiData: FetchApiDataService) { }

ngOnInit(): void {
  this.getMovies();
  this.breakpoint = (window.innerWidth <= 1200) ? 1 : 5;
}
onResize(event:any) {
  this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 5;
}
getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
}