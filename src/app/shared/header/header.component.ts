import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/interceptor/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    public authService: AuthService
  ){}

}
