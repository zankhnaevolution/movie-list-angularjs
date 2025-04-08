import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userData: any = {
    email: 'zankhna.d@evolutioncloud.in',
    password: 'Evolution@123',
    rememberMe: false,
  };

  isSuccess: boolean = true;
  signinError = null;
  isPassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  changeInputTye(){
    this.isPassword = !this.isPassword;
  }

  async formSubmit() {
    this.authService.signIn(this.userData).subscribe({
      next: (data) => {
        this.isSuccess = true;
        // this.cookieService.set("access_token", data.access_token)
        // this.cookieService.set("refresh_token", data.refresh_token)

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        this.router.navigate(['movies']);
      },
      error: (err) => {
        if (err?.error?.message) {
          this.isSuccess = false;
          this.signinError = err.error.message;
        }
      },
    });
  }
}
