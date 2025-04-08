import { Component, OnInit } from '@angular/core';
import { FetchService } from '../../../services/fetch.service';
import { Movie } from '../../../interfaces/movie';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private fetchService: FetchService,
    private authService: AuthService
  ) {
    this.publicURL = environment.BACKEND_API_CALL_URL;
    this.getMovies(this.currentPage);
  }

  movieList: Array<Movie> = [];
  totalPages: Array<number> = [];
  currentPage: number = 1;
  publicURL: string = '';

  getMovies(page: number) {
    this.fetchService
      .getAllMovies({ page })
      .subscribe((res: any) => {
        this.movieList = res.movies;
        this.totalPages = new Array(Math.ceil(parseInt(res.totalMovies) / 8));
        // this.currentPage = page
      });
  }

  changePage(value: number | string){
    if(value == "prev"){
      this.currentPage--;
    }else if(value == "next"){
      this.currentPage++;
    }else{
      this.currentPage = value as number;
    }
    this.getMovies(this.currentPage)
  }

  logoutUser() {
    this.authService.signOut();
  }
}
