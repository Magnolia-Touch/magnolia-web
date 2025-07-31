import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';

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

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
