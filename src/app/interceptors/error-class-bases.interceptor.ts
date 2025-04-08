import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorClassBasesInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    request = this.addToken(request);

    return next.handle(request).pipe(
      catchError((error) => {

        // Check if the error is due to an expired access token
        if (error.status === 401) {
          return this.handleTokenExpired(request, next)
        }

        return throwError(error);
      })
    );
  }

  private addToken(req: any) {
    let token = localStorage.getItem('access_token');
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleTokenExpired(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Call the refresh token endpoint to get a new access token
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Retry the original request with the new access token
        return next.handle(this.addToken(request));
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error handling expired access token:', error);
        return throwError(error);
      })
    );
  }
}


