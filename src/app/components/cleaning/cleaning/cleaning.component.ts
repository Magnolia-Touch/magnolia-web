import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cleaning',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './cleaning.component.html',
  styleUrl: './cleaning.component.css'
})
export class CleaningComponent {

}
