import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    const { email, password, rememberMe } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        console.log('Login success', res);

        if (res.token) {
          if (rememberMe) {
            localStorage.setItem('token', res.token);
          } else {
            sessionStorage.setItem('token', res.token);
          }
        }
        if (res.user) {
          const userData = JSON.stringify(res.user);
          if (rememberMe) {
            localStorage.setItem('user', userData);
          } else {
            sessionStorage.setItem('user', userData);
          }
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Login failed: ' + (err.error || err.message));
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}