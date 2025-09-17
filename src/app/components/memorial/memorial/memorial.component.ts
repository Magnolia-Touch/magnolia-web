import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-memorial',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './memorial.component.html',
  styleUrl: './memorial.component.css'
})
export class MemorialComponent {

  constructor(
    private router: Router
  ){}

  goTo(url:string){
    this.router.navigate([`${url}`])
  }

}
