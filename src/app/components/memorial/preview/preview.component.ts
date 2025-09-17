import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit {
  @Input() memorialForm?: any;
  data: any;
  profilePhotoUrlValue: string | null = null;

  ngOnInit(): void {
    if (this.memorialForm) {
      this.data = {
        firstName: this.memorialForm.get('firstName')?.value,
        lastName: this.memorialForm.get('lastName')?.value,
        dob: this.memorialForm.get('dob')?.value,
        dop: this.memorialForm.get('dop')?.value,
        location: this.memorialForm.get('location')?.value,
        facebook: this.memorialForm.get('facebook')?.value,
        twitter: this.memorialForm.get('twitter')?.value,
        instagram: this.memorialForm.get('instagram')?.value,
        journey: this.memorialForm.get('journey')?.value,
        familyMembers: this.memorialForm.get('familyMembers')?.value || [],
        lifeEvents: this.memorialForm.get('lifeEvents')?.value || [],
        gallery: this.memorialForm.get('gallery')?.value || [],
        profilePhoto: this.memorialForm.get('profilePhoto')?.value || null
      };

      // Generate profile photo URL once
      const file = this.data.profilePhoto;
      if (file && typeof file !== 'string') {
        this.profilePhotoUrlValue = URL.createObjectURL(file);
      } else {
        this.profilePhotoUrlValue = file;
      }
    }
  }

  getFormattedDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return `${date.day}-${date.month}-${date.year}`;
  }

  get profilePhotoUrl(): string | null {
    return this.profilePhotoUrlValue;
  }
}
