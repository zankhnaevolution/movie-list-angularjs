import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public $refresh = new Subject<boolean>();
  public $refreshTokenReceived = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.$refresh.subscribe((res: any) => {
      this.refreshToken();
    });
  }

  signIn(data: any): Observable<any> {
    let url = `${environment.BACKEND_API_CALL_URL}/signin`;
    return this.http.post(url, data);
  }

  isAuthenticated() {
    // return this.cookieService.get('access_token') ? true : false;
    return localStorage.getItem('access_token') ? true : false;
  }

  signOut() {
    // this.cookieService.delete("access_token");
    // this.cookieService.delete("refresh_token");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    // Call the refresh token endpoint to get a new access token
    const refresh_token = localStorage.getItem('refresh_token');
    return this.http
      .post<any>(`${environment.BACKEND_API_CALL_URL}/refresh_token`, {
        refresh_token,
      })
      .pipe(
        tap((response) => {
          // Update the access token in the local storage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        }),
        catchError((error) => {
          // Handle refresh token error (e.g., redirect to login page)
          console.error('Error refreshing access token:', error);
          return throwError(error);
        })
      );
  }
}
