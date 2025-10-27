import { CommonModule } from '@angular/common';
import { Component, Input, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../shared/alert/service/alert.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../profile/service/profile.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true;
  showLoginPassword = false;

  loginForm: FormGroup;
  signupForm: FormGroup;
  isLoadingLogin = false;
  isLoadingSignup = false;
  @Input() isModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private modalRef: NgbModal,
    private profileService: ProfileService,
    @Optional() private activeModal: NgbActiveModal,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      customer_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoadingLogin = true;
      const identifier = this.loginForm.value.email
      const password = this.loginForm.value.password

      this.authService.login(identifier, password).subscribe({
        next: (response: any) => {
          this.isLoadingLogin = false;
          this.alertService.showAlert({
            message: 'Login Successfull',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });

          if (this.isModal) {
            this.activeModal.close('success')
          }

          if (!this.isModal) {
            this.router.navigate(['/home']);
          }
        },
        error: (error: any) => {
          this.isLoadingLogin = false;
          console.error('Login failed:', error);
          this.alertService.showAlert({
            message: error.error.message || 'Login failed. Try again.',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoadingSignup = true;
      const { customer_name, email, Phone, password } = this.signupForm.value;

      const payload = { customer_name, email, Phone, password };

      this.authService.signup(payload).subscribe({
        next: (response: any) => {
          this.isLoadingSignup = false;

          this.alertService.showAlert({
            message: 'Signup Successful! Please login.',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });

          this.loginForm.patchValue({
            email: email,
            password: password
          });

          this.isLogin = true; // switch to login tab
          this.signupForm.reset();
        },
        error: (error: any) => {
          this.isLoadingSignup = false;
          this.alertService.showAlert({
            message: error.error.message || 'Signup failed. Try again.',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  closeModal() {
  if (this.activeModal) {
    this.activeModal.dismiss('closed');
  }
}

}
