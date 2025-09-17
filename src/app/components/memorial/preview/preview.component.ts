import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit {
  @Input() memorialForm?: any; 

  data: any;

  ngOnInit(): void {
    this.data = this.memorialForm || {
      firstName: 'Kuriakose',
      lastName: 'George',
      dob: { year: 1990, month: 5, day: 15 },
      dop: { year: 2025, month: 9, day: 30 },
      location: 'Ernakulam',
      facebook: 'https://facebook.com/kuriakose',
      twitter: 'https://twitter.com/kuriakose',
      instagram: 'https://instagram.com/kuriakose',
      journey: 'Kuriakose had a beautiful life, full of memories and achievements.',
      familyMembers: [
        { name: 'Das', relation: 'Brother' },
        { name: 'Anu', relation: 'Sister' }
      ],
      lifeEvents: [
        { year: '2009', event: 'Graduated from school' },
        { year: '2015', event: 'Started first job' }
      ],
      gallery: [
        '/step4.png',
        '/services2.png',
        '/imgp2.png'
      ],
      profilePhoto: '/services3.png'
    };
  }

  getFormattedDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return `${date.day}-${date.month}-${date.year}`;
  }

  get profilePhotoUrl(): string | null {
    const file = this.data.profilePhoto;
    if (!file) return null;
    return typeof file === 'string' ? file : null;
  }
}
