import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flowers',
  imports: [CommonModule],
  templateUrl: './flowers.component.html',
  styleUrl: './flowers.component.css'
})
export class FlowersComponent {
  flowers = [
    { img: 'flower.png', name: 'Roses', count: '12', price: '$20' },
    { img: 'flower.png', name: 'Lilies', count: '8', price: '$25' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Carnations', count: '15', price: '$18' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
    { img: 'flower.png', name: 'Tulips', count: '10', price: '$22' },
  ];

  constructor(
    public activeModal: NgbActiveModal
  ){}
}
