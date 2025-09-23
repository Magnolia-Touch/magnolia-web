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

  profilePhotoUrlValue: string | null = null;
  galleryUrls: string[] = [];
  data: any;

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
      next: (res) => {
        this.memorialData = res;
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

  get profilePhotoUrl(): string | null {
    return this.profilePhotoUrlValue;
  }

  openGalleryModal(content: TemplateRef<any>) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(content, { size: 'lg', centered: true });
  }

}
