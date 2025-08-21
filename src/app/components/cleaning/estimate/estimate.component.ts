import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estimate',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './estimate.component.html',
  styleUrl: './estimate.component.css'
})
export class EstimateComponent {

  step: number = 1;
  estimateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.estimateForm = this.fb.group({
      // Step 1
      cemeteryNo: ['', Validators.required],
      cemeteryName: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      plan: ['', Validators.required],

      // Step 2
      firstCleaningDate: [null, Validators.required],
      secondCleaningDate: [null, Validators.required],
      anniversaryFlowers: [null, Validators.required],

      // Step 3
      anniversaryDate: [null, Validators.required],
      note: ['']
    });
  }

  nextStep() {
    if (this.step === 1) {
      const group = ['cemeteryNo', 'cemeteryName', 'city', 'state', 'plan'];
      this.markTouched(group);
      if (group.every(c => this.estimateForm.get(c)?.valid)) {
        this.step = 2;
      }
    } else if (this.step === 2) {
      const group = ['firstCleaningDate', 'secondCleaningDate', 'anniversaryFlowers'];
      this.markTouched(group);
      if (group.every(c => this.estimateForm.get(c)?.valid)) {
        this.step = 3;
      }
    }
  }

  submitForm() {
    const group = ['anniversaryDate'];
    this.markTouched(group);
    if (this.estimateForm.valid) {
      console.log("Form Data:", this.estimateForm.value);
      // Navigate to Step 4 component
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.estimateForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }

  private markTouched(controls: string[]) {
    controls.forEach(c => this.estimateForm.get(c)?.markAsTouched());
  }

}
