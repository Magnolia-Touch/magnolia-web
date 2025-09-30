import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemorialService } from '../service/memorial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/alert/service/alert.service';
import { AuthService } from '../../../core/interceptor/auth.service';
import { ConfirmationService } from '../../../shared/confirmation-modal/service/confirmation.service';

@Component({
  selector: 'app-display',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {

  memorialData: any;
  loading = true;
  error: string | null = null;

  profilePhotoUrl: string | null = null;
  galleryUrls: string[] = [];

  guestForm!: FormGroup;
  unApprovedGb!: any[];
  approvedGb!: any[];
  user!: any;

  constructor(
    private route: ActivatedRoute,
    private memorialService: MemorialService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchMemorial(id);
      }
    });

    this.guestForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      guestemail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.user = this.authService.getUser()
    this.loadUnApprovedGB()
    this.loadApprovedGB()
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

  openGuestbookModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  submitGuestBook(modal: any) {
    if (this.guestForm.invalid) return;

    const payload = this.guestForm.value;
    const code = this.route.snapshot.paramMap.get('id');

    this.memorialService.addGuestBook(payload, code).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Message Added',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        modal.close();
        this.guestForm.reset();
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message || 'Message failed to add. Try again.',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  loadUnApprovedGB() {
    const code = this.route.snapshot.paramMap.get('id');
    this.memorialService.UnApproveGuestBook(code).subscribe({
      next: (res: any) => {
        this.unApprovedGb = res.data.guestBookItems;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadApprovedGB() {
    const code = this.route.snapshot.paramMap.get('id');
    this.memorialService.approveGuestBook(code).subscribe({
      next: (res: any) => {
        this.approvedGb = res.data.guestBookItems;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  async approveGuestBook(item: any) {
    const code = this.route.snapshot.paramMap.get('id');
    if (!code) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Approve Guestbook',
      message: 'Do you want to approve this entry?',
      confirmText: 'Yes',
      cancelText: 'No'
    });

    if (confirmed) {
      this.memorialService.updateGuestBookStatus(code, item.guestbookitems_id).subscribe({
        next: () => {
          this.alertService.showAlert({
            message: 'Guestbook entry approved',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });
          this.unApprovedGb = this.unApprovedGb.filter(gb => gb.guestbookitems_id !== item.guestbookitems_id);
          this.loadApprovedGB();
        },
        error: (err) => {
          this.alertService.showAlert({
            message: err.error.message || 'Failed to approve entry',
            type: 'error',
            autoDismiss: true,
            duration: 3000
          });
        }
      });
    }
  }

  async deleteGuestBook(item: any, type: 'approved' | 'unapproved') {
    const code = this.route.snapshot.paramMap.get('id');
    if (!code) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this guestbook entry?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.memorialService.deleteGuestBook(code, item.guestbookitems_id).subscribe({
        next: () => {
          this.alertService.showAlert({
            message: 'Guestbook entry deleted',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });

          if (type === 'approved') {
            this.approvedGb = this.approvedGb.filter(gb => gb.guestbookitems_id !== item.guestbookitems_id);
          } else {
            this.unApprovedGb = this.unApprovedGb.filter(gb => gb.guestbookitems_id !== item.guestbookitems_id);
          }
        },
        error: (err) => {
          this.alertService.showAlert({
            message: err.error.message || 'Failed to delete entry',
            type: 'error',
            autoDismiss: true,
            duration: 3000
          });
        }
      });
    }
  }

}
