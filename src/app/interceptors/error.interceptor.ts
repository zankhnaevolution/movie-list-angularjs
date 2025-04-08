import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService)

  req = addToken(req);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        
        return authService.refreshToken().pipe(

          switchMap(() => {
            // Retry the original request with the new access token
            return next(addToken(req));
          }),
          catchError((error) => {
            // Handle refresh token error (e.g., redirect to login page)
            console.error('Error handling expired access token:', error);
            return throwError(error);
          })
        );
      }
      return throwError(error)
    })
  );
};

const addToken = (req: any) => {
  let token = localStorage.getItem('access_token');
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
