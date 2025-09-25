import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProfileService } from './service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile!: any;
  loading: boolean = false;
  activeSubs: any[] = [];
  editMode = false;
  profileForm!: FormGroup;

  constructor(
    private service: ProfileService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadProfile()
    this.loadActiveSubs()
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


}
