import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, HeaderComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  step = 1;
  memorialForm: FormGroup;
  profilePhoto: File | null = null;
  galleryPhotos: File[] = [];

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
      familyMembers: this.fb.array([]),
      lifeEvents: this.fb.array([]),
      gallery: [[]]
    });
  }

  get familyMembers(): FormArray {
    return this.memorialForm.get('familyMembers') as FormArray;
  }

  get lifeEvents(): FormArray {
    return this.memorialForm.get('lifeEvents') as FormArray;
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
    this.profilePhoto = event.target.files[0];
  }

  onGallerySelected(event: any) {
    this.galleryPhotos = Array.from(event.target.files);
    this.memorialForm.patchValue({ gallery: this.galleryPhotos });
  }

  nextStep() {
    if (this.step < 6) this.step++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
}
