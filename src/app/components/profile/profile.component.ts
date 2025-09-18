import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProfileService } from './service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile!: any;
   loading: boolean = false;

  constructor(
    private service: ProfileService,
    private alertService: AlertService
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
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err)
      }
    })
  }

  loadActiveSubs(){
    this.service.getActiveSubs().subscribe({
      next: (res:any) =>{
        console.log(res);
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

}
