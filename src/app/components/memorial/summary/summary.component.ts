import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemorialService } from '../service/memorial.service';
import { AlertService } from '../../../shared/alert/service/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-summary-mem',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  payload: any;
  serviceMethod: string = 'online';
  cemetery = { no: '', name: '', cityState: '' };
  profilePhotoUrl: string = '';
  addresses: any[] = [];
  addressForm: FormGroup;
  selectedAddress: any = null;

  constructor(
    private router: Router,
    private service: MemorialService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.payload = nav?.extras.state;

    this.addressForm = this.fb.group({
      Name: ['', Validators.required],
      street: ['', Validators.required],
      town_or_city: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (!this.payload) return;

    const { form, profilePhoto, galleryPhotos } = this.payload;

    const apiData = new FormData();
    apiData.append('data', new Blob([JSON.stringify(form)], { type: 'application/json' }));

    if (profilePhoto) {
      this.profilePhotoUrl = URL.createObjectURL(profilePhoto);
      apiData.append('profile_image', profilePhoto);
    }

    galleryPhotos.forEach((file: File) => {
      apiData.append('gallery', file);
    });

    this.loadAddress()
  }

  ngOnDestroy(): void {
    if (this.profilePhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.profilePhotoUrl);
    }
  }

  loadAddress() {
    this.service.getAddress().subscribe({
      next: (res: any) => {
        this.addresses = res;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  generateQR(): void {
    if (!this.payload) return;

    const { form, profilePhoto, galleryPhotos } = this.payload;

    const socialLinks = [];
    if (form.facebook) {
      socialLinks.push({ socialMediaName: 'Facebook', link: form.facebook });
    }
    if (form.twitter) {
      socialLinks.push({ socialMediaName: 'Twitter', link: form.twitter });
    }
    if (form.instagram) {
      socialLinks.push({ socialMediaName: 'Instagram', link: form.instagram });
    }

    const memorialData = {
      firstName: form.firstName,
      lastName: form.lastName,
      born_date: `${form.dob.year}-${form.dob.month}-${form.dob.day}`,
      death_date: `${form.dop.year}-${form.dop.month}-${form.dop.day}`,
      memorial_place: form.location,
      biography: [{ discription: form.journey || "No biography provided" }],
      family: form.familyMembers || [],
      socialLinks: socialLinks || [],
      events: form.lifeEvents || []
    };

    const apiData = new FormData();

    // Append primitive fields
    apiData.append('firstName', memorialData.firstName);
    apiData.append('lastName', memorialData.lastName);
    apiData.append('born_date', memorialData.born_date);
    apiData.append('death_date', memorialData.death_date);
    apiData.append('memorial_place', memorialData.memorial_place);

    // Append JSON arrays as stringified
    apiData.append('biography', JSON.stringify(memorialData.biography));
    apiData.append('family', JSON.stringify(memorialData.family));
    apiData.append('socialLinks', JSON.stringify(memorialData.socialLinks));
    apiData.append('events', JSON.stringify(memorialData.events));

    // Append files
    if (profilePhoto) {
      apiData.append('profile_image', profilePhoto);
    }

    if (galleryPhotos && galleryPhotos.length > 0) {
      galleryPhotos.forEach((file: File) => {
        apiData.append('gallery', file);
      });
    }

    this.service.createMemorial(apiData).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Memorial created successfully',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        // this.router.navigate(['/success'])
        this.payment(res)
      },
      error: (err) => {
        console.error('Error creating memorial:', err);
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  payment(itm: any) {
    const pay = {
      shippingaddressId: this.selectedAddress.deli_address_id,
      currency: "INR",
      billingaddressId: this.selectedAddress.deli_address_id,
      memoryProfileId: itm.slug
    }
    this.service.createPayment(pay).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    })

  }

  openAddressModal(modalTemplate: TemplateRef<any>) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(modalTemplate, { centered: true, backdrop: 'static' });
  }

  saveAddress() {
    if (!this.addressForm.valid) return;

    this.service.addAddress(this.addressForm.value).subscribe({
      next: () => {
        this.alertService.showAlert({ message: 'Address saved successfully', type: 'success', autoDismiss: true });
        this.loadAddress()
        this.modalService.dismissAll()
        this.addressForm.reset();
      },
      error: (err) => this.alertService.showAlert({ message: err.error.message, type: 'error', autoDismiss: true })
    });
  }

}
