import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  galleryUrls: string[] = [];

  constructor(private modalService: NgbModal) { }

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

      this.data.lifeEvents.sort((a: any, b: any) => Number(a.year) - Number(b.year));

      const file = this.data.profilePhoto;
      if (file && typeof file !== 'string') {
        this.profilePhotoUrlValue = URL.createObjectURL(file);
      } else {
        this.profilePhotoUrlValue = file;
      }

      this.galleryUrls = (this.data.gallery || []).map((img: any) => {
        if (img && typeof img !== 'string') {
          return URL.createObjectURL(img);
        }
        return img;
      });

      console.log(this.memorialForm);
      
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

  openGalleryModal(content: TemplateRef<any>) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }
}
