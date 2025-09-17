import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-preview',
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit {
  @Input() memorialForm!: FormGroup;

  ngOnInit(): void {
    console.log(this.memorialForm);

  }

  getFormattedDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return `${date.day}-${date.month}-${date.year}`;
  }

  get f() {
    return this.memorialForm.controls;
  }
}
