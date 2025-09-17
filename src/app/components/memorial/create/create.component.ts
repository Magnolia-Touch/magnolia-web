import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "../../../shared/header/header.component";
import { PreviewComponent } from "../preview/preview.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, HeaderComponent, PreviewComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  step = 1;
  memorialForm: FormGroup;
  profilePhoto: File | null = null;
  galleryPhotos: File[] = [];
  galleryPreviews: string[] = [];

  years: number[] = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);

  constructor(private fb: FormBuilder) {
    this.memorialForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [null, Validators.required],
      dop: [null, Validators.required],
      location: ['', Validators.required],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      journey: ['', Validators.required],
      familyMembers: this.fb.array([this.createFamilyMember()]),
      lifeEvents: this.fb.array([this.createLifeEvent()]),
      gallery: [[]],
      profilePhoto: [null]
    });
  }

  createFamilyMember(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      relation: ['', Validators.required]
    });
  }

  createLifeEvent(): FormGroup {
    return this.fb.group({
      year: ['', Validators.required],
      event: ['', Validators.required]
    });
  }

  get familyMembers(): FormArray {
    return this.memorialForm.get('familyMembers') as FormArray;
  }

  get lifeEvents(): FormArray {
    return this.memorialForm.get('lifeEvents') as FormArray;
  }

  nextStep() {
    let valid = false;

    switch (this.step) {
      case 1:
        valid =
          !!this.memorialForm.get('firstName')?.valid &&
          !!this.memorialForm.get('lastName')?.valid &&
          !!this.memorialForm.get('dob')?.valid &&
          !!this.memorialForm.get('dop')?.valid &&
          !!this.memorialForm.get('location')?.valid;
        break;

      case 2:
        valid = !!this.memorialForm.get('journey')?.valid;
        break;

      case 3:
        valid = this.familyMembers.length > 0 && this.familyMembers.valid;
        break;

      case 4:
        valid = this.lifeEvents.length > 0 && this.lifeEvents.valid;
        break;

      case 5:
        valid = this.galleryPhotos.length > 0;
        break;

      default:
        valid = true;
    }

    if (valid) {
      if (this.step < 6) this.step++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      Object.keys(this.memorialForm.controls).forEach(c =>
        this.memorialForm.get(c)?.markAsTouched()
      );
      if (this.step === 3) this.familyMembers.controls.forEach(c => c.markAllAsTouched());
      if (this.step === 4) this.lifeEvents.controls.forEach(c => c.markAllAsTouched());
    }
  }

  addFamilyMember() {
    this.familyMembers.push(this.fb.group({
      name: ['', Validators.required],
      relation: ['', Validators.required]
    }));
  }

  addLifeEvent() {
    this.lifeEvents.push(this.fb.group({
      year: [new Date().getFullYear(), Validators.required],
      event: ['', Validators.required]
    }));
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePhoto = file;
      this.memorialForm.patchValue({ profilePhoto: file });
    }
  }

  onGallerySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles: File[] = Array.from(input.files);

    this.galleryPhotos = [...this.galleryPhotos, ...newFiles];

    this.galleryPreviews = [];
    this.galleryPhotos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleryPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.memorialForm.patchValue({ gallery: this.galleryPhotos });

    input.value = '';
  }

  prevStep() {
    if (this.step > 1) this.step--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  hasError(control: string, error: string) {
    const ctrl = this.memorialForm.get(control);
    return !!(ctrl?.touched && ctrl?.hasError(error));
  }

  submitForm() {
    if (this.memorialForm.valid) {
      console.log("Final Payload:", this.memorialForm.value, this.profilePhoto, this.galleryPhotos);
      // Send to API
    } else {
      Object.keys(this.memorialForm.controls).forEach(c => this.memorialForm.get(c)?.markAsTouched());
    }
  }

  removeFamilyMember(i: number) {
    if (this.familyMembers.length > 1) {
      this.familyMembers.removeAt(i);
    }
  }

  removeLifeEvent(i: number) {
    if (this.lifeEvents.length > 1) {
      this.lifeEvents.removeAt(i);
    }
  }

  removeGalleryImage(index: number) {
    this.galleryPhotos.splice(index, 1);
    this.galleryPreviews.splice(index, 1);

    this.memorialForm.patchValue({ gallery: this.galleryPhotos });
  }

}
