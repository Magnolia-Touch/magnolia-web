import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemorialService } from '../service/memorial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {

  memorialData: any;
  loading = true;
  error: string | null = null;

  profilePhotoUrl: string | null = null;
  galleryUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private memorialService: MemorialService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchMemorial(id);
      }
    });
  }

  fetchMemorial(id: string): void {
    this.loading = true;
    this.memorialService.getMemorial(id).subscribe({
      next: (res: any) => {
        this.memorialData = res.data;

        // Set profile photo
        this.profilePhotoUrl = this.memorialData.profile_image;

        // Map gallery URLs
        this.galleryUrls = this.memorialData.gallery.map((g: any) => g.link);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load memorial data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getFormattedDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return `${date.day}-${date.month}-${date.year}`;
  }

  openGalleryModal(content: TemplateRef<any>) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  getBiography(): string {
    return this.memorialData?.biography?.[0]?.discription || '';
  }

}
