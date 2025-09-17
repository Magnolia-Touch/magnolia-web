import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-journey',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css'
})
export class JourneyComponent {

  constructor(
    private router: Router
  ){}

  goTo(url:string){
    this.router.navigate([`${url}`])
  }

}
