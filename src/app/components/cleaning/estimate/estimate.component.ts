import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlowersComponent } from '../flowers/flowers.component';
import { CleaningService } from '../service/cleaning.service';
import { environment } from '../../../../environment/environment';
import { AlertService } from '../../../shared/alert/service/alert.service';
import { LoginComponent } from '../../login/login.component';
import { AuthService } from '../../../core/interceptor/auth.service';

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
  selectedPlan: any = null;
  allFlowers!: any[];
  selectedFlowerID: any = null;
  url = environment.apiUrl
  summary: any;
  selectedFlowerName!: any;
  isSubmitting = false;

  flowers = [
    { img: 'flower.png', name: 'Roses', count: '12', price: '$20' },
    { img: 'flower.png', name: 'Lilies', count: '8', price: '$25' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Carnations', count: '15', price: '$18' }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: CleaningService,
    private alertService: AlertService,
    private authService: AuthService
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
      subscriptionYears: [1, [Validators.required, Validators.min(1)]],

      // Step 3
      anniversaryDate: [null, Validators.required],
      note: ['']
    });

    this.watchValidation();
  }

  ngOnInit(): void {
    this.loadPlans()
    this.loadFlowers()

    this.estimateForm.get('plan')?.valueChanges.subscribe(planId => {
      this.selectedPlan = this.allPlans.find(p => p.Subscription_id === planId) || null;
      this.updateDateValidators();
    });

    this.estimateForm.get('anniversaryFlowers')?.valueChanges.subscribe(value => {
      const anniversaryDateCtrl = this.estimateForm.get('anniversaryDate');

      if (value === 'Yes') {
        anniversaryDateCtrl?.setValidators([Validators.required]);
      } else {
        anniversaryDateCtrl?.clearValidators();
        anniversaryDateCtrl?.reset();
      }

      anniversaryDateCtrl?.updateValueAndValidity();
    });
  }

  loadPlans() {
    this.service.getAllPlans().subscribe({
      next: (res: any) => {
        this.allPlans = res.data || [];
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  loadFlowers() {
    this.service.getFlowers().subscribe({
      next: (res: any) => {
        this.allFlowers = res.data || [];
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  private updateDateValidators() {
    const firstCtrl = this.estimateForm.get('firstCleaningDate');
    const secondCtrl = this.estimateForm.get('secondCleaningDate');

    if (!this.selectedPlan) return;

    if (this.selectedPlan.Frequency === 1) {
      // Once yearly → only first date required
      firstCtrl?.setValidators([Validators.required]);
      secondCtrl?.clearValidators();
      secondCtrl?.reset(); // clear value
    } else if (this.selectedPlan.Frequency === 2) {
      // Twice yearly → both required
      firstCtrl?.setValidators([Validators.required]);
      secondCtrl?.setValidators([Validators.required]);
    } else {
      // fallback (custom cleaning)
      firstCtrl?.setValidators([Validators.required]);
      secondCtrl?.clearValidators();
      secondCtrl?.reset();
    }

    firstCtrl?.updateValueAndValidity();
    secondCtrl?.updateValueAndValidity();
  }

  watchValidation() {
    // auto-advance logic
    this.estimateForm.valueChanges.subscribe(() => {
      if (this.step === 1 && this.isGroupValid(['cemeteryNo', 'cemeteryName', 'memorialName', 'city', 'state', 'plan'])) {
        this.step = 2;
      }
      if (this.step === 2 && this.isGroupValid(['firstCleaningDate', 'secondCleaningDate', 'anniversaryFlowers', 'subscriptionYears'])) {
        if (this.estimateForm.get('anniversaryFlowers')?.value === 'Yes') {
          this.step = 3;
        }
      }
    });
  }

  submitForm() {
    if (this.estimateForm.valid) {
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
      const formValue = this.estimateForm.value;

      const selectedPlan = this.allPlans.find(p => p.Subscription_id === formValue.plan);
      const planCost = selectedPlan ? Number(selectedPlan.Price) * formValue.subscriptionYears : 0;

      let flowerCost = 0;
      let flowerNote = '';
      if (formValue.anniversaryFlowers === 'Yes') {
        const addedFlower = this.allFlowers.find(f => f.flower_id === this.selectedFlowerID);
        flowerCost = addedFlower ? Number(addedFlower.Price) : 0;
        flowerNote = formValue.note || '';
        this.selectedFlowerName = addedFlower.Name
      }

      const total = planCost + flowerCost;

      this.summary = {
        planName: selectedPlan?.Subscription_name,
        planDesc: selectedPlan?.discription,
        planCost,
        anniversaryFlowers: formValue.anniversaryFlowers,
        flowerName: this.selectedFlowerName,
        flowerCost,
        flowerNote,
        total
      };

      this.step = 4;
      this.scrollToTop();
    } else {
      this.estimateForm.markAllAsTouched();
    }
  }

  addFlower(id: any) {
    this.selectedFlowerID = id;
    this.alertService.showAlert({
      message: 'Flower has been added;',
      type: 'success',
      autoDismiss: true,
      duration: 4000
    });
  }

  openFlowerModal() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const modalRef = this.modalService.open(FlowersComponent, { size: 'lg', scrollable: true });

    modalRef.result.then((result) => {
      if (result && result.id) {
        this.selectedFlowerID = this.allFlowers.find(f => f.flower_id === result.id)?.flower_id || null;
      }
    }).catch(() => { });
  }

  createService() {

    if (!this.authService.isLoggedIn()) {
      const buttonElement = document.activeElement as HTMLElement;
      buttonElement.blur();

      const modalRef = this.modalService.open(LoginComponent, { size: 'md', backdrop: 'static' });
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result === 'success') {
          this.createService();
        }
      }).catch(() => { });

      return;
    }

    if (!this.estimateForm.valid) {
      this.markTouched(Object.keys(this.estimateForm.controls));
      return;
    }

    this.isSubmitting = true;
    const formValue = this.estimateForm.value;

    const payload = {
      name_on_memorial: formValue.memorialName,
      church_name: formValue.cemeteryName,
      plot_no: formValue.cemeteryNo,
      city: formValue.city,
      state: formValue.state,
      subscription_id: formValue.plan,
      first_cleaning_date: this.formatDate(formValue.firstCleaningDate),
      second_cleaning_date: this.formatDate(formValue.secondCleaningDate),
      anniversary_date: this.formatDate(formValue.anniversaryDate),
      no_of_subsribe_years: formValue.subscriptionYears,
      status: "pending",
      flower_id: this.selectedFlowerID || null,
      note: formValue.note || null,
      successUrl: 'https://magnoliatouch.com/success',
      cancelUrl: 'https://magnoliatouch.com/failed'
    };

    this.service.newService(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.booking && res.booking.checkout_url) {
          window.location.href = res.booking.checkout_url;
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  private formatDate(date: any): string | null {
    if (!date) return null;

    if (typeof date === 'object' && date.year && date.month && date.day) {
      const year = date.year;
      const month = String(date.month).padStart(2, '0');
      const day = String(date.day).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}