import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-memorial',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './memorial.component.html',
  styleUrl: './memorial.component.css'
})
export class MemorialComponent {

}
