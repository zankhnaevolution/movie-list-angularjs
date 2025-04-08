import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development'; 
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getAllMovies({ page= 1 }: { page?: number | string }){
    const url = `${environment.BACKEND_API_CALL_URL}/movie?page=${page}`;
    return this.http.get(url);
  }

  storeMovie(movieObject: FormData): Observable<any>{
    const url = `${environment.BACKEND_API_CALL_URL}/movie`;
    return this.http.post(url, movieObject);
  }

  getSingleMovie(id: string){
    const url = `${environment.BACKEND_API_CALL_URL}/movie/${id}`;
    return this.http.get(url);
  }

}
