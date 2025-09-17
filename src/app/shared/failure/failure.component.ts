import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failure',
  imports: [CommonModule],
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.css'
})
export class FailureComponent {
  showGoHomeBtn = false;

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showGoHomeBtn = true;
    }, 1000);
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
