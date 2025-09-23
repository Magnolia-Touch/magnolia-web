import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "../../../shared/header/header.component";
import { PreviewComponent } from "../preview/preview.component";
import { AuthService } from '../../../core/interceptor/auth.service';
import { MemorialService } from '../service/memorial.service';
import { AlertService } from '../../../shared/alert/service/alert.service';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private service: MemorialService,
    private alertService: AlertService
  ) {
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
      year: [new Date().getFullYear(), Validators.required],
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
      const formValue = this.memorialForm.value;

      const payload = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        born_date: this.formatDate(formValue.dob),
        death_date: this.formatDate(formValue.dop),
        memorial_place: formValue.location,
        profile_image: this.profilePhoto ? URL.createObjectURL(this.profilePhoto) : null,
        background_image: null,
        is_paid: false,

        biography: [
          { discription: formValue.journey }
        ],

        gallery: this.galleryPhotos.map((file, i) => ({
          link: this.galleryPreviews[i]
        })),

        family: formValue.familyMembers.map((member: any) => ({
          relationship: member.relation,
          name: member.name
        })),

        socialLinks: [
          formValue.facebook ? { socialMediaName: "Facebook", link: formValue.facebook } : null,
          formValue.twitter ? { socialMediaName: "Twitter", link: formValue.twitter } : null,
          formValue.instagram ? { socialMediaName: "Instagram", link: formValue.instagram } : null
        ].filter(x => x !== null),

        events: formValue.lifeEvents.map((e: any) => ({
          year: e.year,
          event: e.event
        }))
      };

      const user = this.authService.getUser()

      this.service.createMemorial(payload, user.email).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alertService.showAlert({
            message: 'Memorial Created',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
        },
        error: (err) => {
          console.error(err);
          this.alertService.showAlert({
            message: err.error.message,
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      })

    } else {
      Object.keys(this.memorialForm.controls).forEach(c => this.memorialForm.get(c)?.markAsTouched());
    }
  }

  private formatDate(dateObj: any): string {
    if (!dateObj) return '';
    const y = dateObj.year;
    const m = ('0' + dateObj.month).slice(-2);
    const d = ('0' + dateObj.day).slice(-2);
    return `${y}-${m}-${d}`;
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
