import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../profile/service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: ProfileService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      const { email } = this.forgotForm.value;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.isLoading = false;
          this.alertService.showAlert({
            message: 'OTP sent to your email!',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.router.navigate(['/resetpassword'], { queryParams: { email } });
        },
        error: (err) => {
          this.isLoading = false;
          this.alertService.showAlert({
            message: err.error.message || 'Failed to send OTP',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }

  goBack() {
    window.history.back();
  }

}
