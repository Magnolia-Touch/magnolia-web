import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/alert/service/alert.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true;
  showLoginPassword = false;

  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const identifier = this.loginForm.value.email
      const password = this.loginForm.value.password

      this.authService.login(identifier, password).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this.alertService.showAlert({
            message: 'Login Successfull',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.error('Login failed:', error);
        }
      });
    }
  }

  onSignup() {
    console.log(this.signupForm.value);
  }
}
