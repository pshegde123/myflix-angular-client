import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { RouterModule,Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { MatListModule} from '@angular/material/list';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieDialogComponent } from './movie-dialog/movie-dialog.component';



const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: ProfileViewComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserLoginFormComponent,
    MovieCardComponent,
    WelcomePageComponent,
    MessageBoxComponent,
    ProfileViewComponent,
    MovieDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridTile,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    MatProgressSpinnerModule,
  ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
