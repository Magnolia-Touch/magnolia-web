import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/interceptor/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../confirmation-modal/service/confirmation.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    public authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  async logOut() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Log Out',
      message: 'Do you really want to log out?',
      confirmText: 'LogOut',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.authService.logout();
    }
  }

}
