import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "../../shared/footer/footer.component";
import { ContactService } from './service/contact.service';
import { AlertService } from '../../shared/alert/service/alert.service';

@Component({
  selector: 'app-contact',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: ContactService,
    private alertService: AlertService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      // subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      Name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      phone_number: this.contactForm.value.phoneNumber,
      // subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };

    this.service.sendMessage(payload).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Your message has been sent successfully!',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
        this.isSubmitting = false;
      }
    });
  }
}
