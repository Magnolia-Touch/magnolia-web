import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemorialService } from '../service/memorial.service';

@Component({
  selector: 'app-summary-mem',
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  payload: any;
  serviceMethod: string = 'online';
  cemetery = { no: '', name: '', cityState: '' };
  profilePhotoUrl: string = '';

  constructor(
    private router: Router,
    private service: MemorialService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.payload = nav?.extras.state;
    console.log("Received data:", this.payload);
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

  }

  ngOnDestroy(): void {
    if (this.profilePhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.profilePhotoUrl);
    }
  }

  generateQR(): void {
    if (!this.payload) return;

    const { form, profilePhoto, galleryPhotos } = this.payload;

    const memorialData = {
      firstName: form.firstName,
      lastName: form.lastName,
      born_date: `${form.dob.year}-${form.dob.month}-${form.dob.day}`,
      death_date: `${form.dop.year}-${form.dop.month}-${form.dop.day}`,
      memorial_place: form.location,
      is_paid: true,
      profile_image: '',       // will be replaced by backend from file
      background_image: '',    // optional background
      biography: [
        { discription: form.biography || "No biography provided" }
      ],
      gallery: [],
      family: form.family || [],
      socialLinks: form.socialLinks || [],
      events: form.events || []
    };

    const apiData = new FormData();
    apiData.append('data', new Blob([JSON.stringify(memorialData)], { type: 'application/json' }));

    if (profilePhoto) {
      apiData.append('profile_image', profilePhoto);
    }

    if (galleryPhotos && galleryPhotos.length > 0) {
      galleryPhotos.forEach((file: File) => {
        apiData.append('gallery', file);
      });
    }

    console.log(apiData);

    this.service.createMemorial(apiData).subscribe({
      next: (res) => {
        console.log('Memorial created successfully:', res);
      },
      error: (err) => {
        console.error('Error creating memorial:', err);
      }
    });
  }

}
