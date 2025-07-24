import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-cleaning',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './cleaning.component.html',
  styleUrl: './cleaning.component.css'
})
export class CleaningComponent {

}
