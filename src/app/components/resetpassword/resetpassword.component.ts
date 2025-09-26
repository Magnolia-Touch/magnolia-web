import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../profile/service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  emailFromQuery = '';

  constructor(
    private fb: FormBuilder,
    private authService: ProfileService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.emailFromQuery = params['email'];
        this.resetForm.patchValue({ email: this.emailFromQuery });
      }
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      const { email, otp, newPassword } = this.resetForm.value;

      this.authService.resetPassword({ email, otp, newPassword }).subscribe({
        next: () => {
          this.isLoading = false;
          this.alertService.showAlert({
            message: 'Password reset successful! Please login.',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.alertService.showAlert({
            message: err.error.message || 'Failed to reset password',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
  
}
