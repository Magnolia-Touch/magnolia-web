import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProfileService } from './service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MemorialService } from '../memorial/service/memorial.service';
import { ConfirmationService } from '../../shared/confirmation-modal/service/confirmation.service';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile!: any;
  loading: boolean = false;
  activeSubs: any[] = [];
  editMode = false;
  profileForm!: FormGroup;
  memorials: any[] = [];
  total = 0;
  page = 1;
  limit = 5;
  search = '';
  passwordForm!: FormGroup;

  addresses: any[] = [];
  addressForm!: FormGroup;
  editAddress: any = null;

  orders: any[] = [];
  orderTotal = 0;
  orderPage = 1;
  orderLimit = 6;

  constructor(
    private service: ProfileService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private memorialService: MemorialService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadProfile()
    this.loadActiveSubs()
    this.loadMemorialProfiles()
    this.initPasswordForm();
    this.loadAddresses();
    this.initAddressForm();
    this.loadOrders();
  }

  initAddressForm() {
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

  initPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  openChangePasswordModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  changePassword(modal: any) {
    if (this.passwordForm.invalid) return;

    this.service.changePassword(this.passwordForm.value).subscribe({
      next: (res: any) => {
        this.alertService.showAlert({
          message: 'Password changed successfully!',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        modal.close();
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.alertService.showAlert({
          message: err.error.message || 'Failed to change password',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  loadProfile() {
    this.loading = true;
    this.service.getUserProfile().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.profile = res.data;
        this.initForm();
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err)
      }
    })
  }

  loadAddresses() {
    this.memorialService.getAddress().subscribe({
      next: (res: any) => {
        this.addresses = res;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  openAddressModal(modalTemplate: any, address: any = null) {
    this.editAddress = address;
    if (address) {
      this.addressForm.patchValue(address);
    } else {
      this.addressForm.reset();
    }
    this.modalService.open(modalTemplate, { centered: true, backdrop: 'static' });
  }

  saveAddress(modal: any) {
    if (this.addressForm.invalid) return;

    if (this.editAddress) {
      this.memorialService.updateAddress(this.editAddress.deli_address_id, this.addressForm.value).subscribe({
        next: () => {
          this.loadAddresses();
          modal.close();
          this.alertService.showAlert({
            message: 'Address updated successfully!',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.memorialService.addAddress(this.addressForm.value).subscribe({
        next: () => {
          this.loadAddresses();
          modal.close();
          this.alertService.showAlert({
            message: 'Address added successfully!',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  async deleteAddress(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete',
      message: 'Are you sure you want to delete this address?',
      confirmText: 'Yes',
      cancelText: 'No'
    });
    if (confirmed) {
      this.memorialService.deleteAddress(id).subscribe({
        next: () => {
          this.loadAddresses();
          this.alertService.showAlert({
            message: 'Address deleted!',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  loadActiveSubs() {
    this.service.getActiveSubs().subscribe({
      next: (res: any) => {
        this.activeSubs = res;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  loadMemorialProfiles() {
    this.service.getMemorials(this.page, this.limit, this.search).subscribe({
      next: (res: any) => {
        this.memorials = res.data;
        this.total = res.pagination.total;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadOrders() {
    this.loading = true;
    this.service.getOrders(this.orderPage, this.orderLimit).subscribe({
      next: (res: any) => {
        this.orders = res.data;
        this.orderTotal = res.meta.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSearchChange(value: string) {
    this.page = 1;
    this.loadMemorialProfiles();
  }

  pageChange(pageNum: number) {
    const last = this.lastPage;
    if (pageNum < 1) {
      this.page = 1;
    } else if (pageNum > last) {
      this.page = last;
    } else {
      this.page = pageNum;
    }
    this.loadMemorialProfiles();
  }

  get totalPages(): number[] {
    const totalPages = Math.ceil(this.total / this.limit);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get lastPage(): number {
    return Math.ceil(this.total / this.limit) || 1;
  }

  orderPageChange(pageNum: number) {
    const last = this.lastOrderPage;
    if (pageNum < 1) {
      this.orderPage = 1;
    } else if (pageNum > last) {
      this.orderPage = last;
    } else {
      this.orderPage = pageNum;
    }
    this.loadOrders();
  }

  get totalOrderPages(): number[] {
    const totalPages = Math.ceil(this.orderTotal / this.orderLimit);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get lastOrderPage(): number {
    return Math.ceil(this.orderTotal / this.orderLimit);
  }

  initForm() {
    this.profileForm = this.fb.group({
      name: [this.profile?.customer_name || '', Validators.required],
      email: [this.profile?.email || '', [Validators.required, Validators.email]],
      Phone: [this.profile?.Phone || '', Validators.required]
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.service.updateUserProfile(this.profileForm.value).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Profile Updated!',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        this.editMode = false;
        this.loadProfile();
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  goToMemorial(profileId: number) {
    this.router.navigate(['/page', profileId]);
  }

}
