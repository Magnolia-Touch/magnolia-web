import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('headingSection') headingSection!: ElementRef;

  scrollToHeading() {
    this.headingSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
