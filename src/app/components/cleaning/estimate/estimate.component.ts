import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlowersComponent } from '../flowers/flowers.component';
import { CleaningService } from '../service/cleaning.service';

@Component({
  selector: 'app-estimate',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './estimate.component.html',
  styleUrl: './estimate.component.css'
})
export class EstimateComponent implements OnInit {

  step: number = 1;
  estimateForm: FormGroup;
  allPlans!: any[];

  flowers = [
    { img: 'flower.png', name: 'Roses', count: '12', price: '$20' },
    { img: 'flower.png', name: 'Lilies', count: '8', price: '$25' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Carnations', count: '15', price: '$18' }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: CleaningService
  ) {
    this.estimateForm = this.fb.group({
      // Step 1
      cemeteryNo: ['', Validators.required],
      cemeteryName: ['', Validators.required],
      memorialName: ['', Validators.required],
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

    this.watchValidation();
  }

  ngOnInit(): void {
    this.loadPlans()
  }

  loadPlans() {
    this.service.getAllPlans().subscribe({
      next: (res: any) => {
        this.allPlans = res.data || [];
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  watchValidation() {
    // auto-advance logic
    this.estimateForm.valueChanges.subscribe(() => {
      if (this.step === 1 && this.isGroupValid(['cemeteryNo', 'cemeteryName', 'memorialName', 'city', 'state', 'plan'])) {
        this.step = 2;
      }
      if (this.step === 2 && this.isGroupValid(['firstCleaningDate', 'secondCleaningDate', 'anniversaryFlowers'])) {
        this.step = 3;
      }
    });
  }

  submitForm() {
    if (this.estimateForm.valid) {
      console.log("Form Data:", this.estimateForm.value);
      this.step = 4; // move to next component flow
      this.scrollToTop();
    } else {
      this.markTouched(Object.keys(this.estimateForm.controls));
    }
  }

  private isGroupValid(fields: string[]): boolean {
    return fields.every(f => this.estimateForm.get(f)?.valid);
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.estimateForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }

  private markTouched(controls: string[]) {
    controls.forEach(c => this.estimateForm.get(c)?.markAsTouched());
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBackToForm() {
    if (this.isGroupValid(['cemeteryNo', 'cemeteryName', 'memorialName', 'city', 'state', 'plan']) &&
      this.isGroupValid(['firstCleaningDate', 'secondCleaningDate', 'anniversaryFlowers']) &&
      this.isGroupValid(['anniversaryDate'])) {
      this.step = 3;
      this.scrollToTop();
    }
  }

  goToSummary() {
    if (this.estimateForm.valid) {
      this.step = 4;
      this.scrollToTop();
    } else {
      this.markTouched(Object.keys(this.estimateForm.controls));
    }
  }

  openFlowerModal() {
    const buttonElement = document.activeElement as HTMLElement
    buttonElement.blur();

    this.modalService.open(FlowersComponent, { size: 'lg', scrollable: true })
  }

}
