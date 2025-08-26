import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CleaningService } from '../service/cleaning.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-flowers',
  imports: [CommonModule],
  templateUrl: './flowers.component.html',
  styleUrl: './flowers.component.css'
})
export class FlowersComponent implements OnInit {

  allFlowers!: any[];
  apiUrl = environment.apiUrl

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
    public activeModal: NgbActiveModal,
    private service: CleaningService
  ) { }

  ngOnInit(): void {
    this.loadFlowers()
  }

  loadFlowers() {
    this.service.getFlowers().subscribe({
      next: (res: any) => {
        this.allFlowers = (res.data || []).map((flower: any) => ({
          id: flower.flower_id,
          img: `${this.apiUrl}/${flower.image}`,
          name: flower.Name,
          price: flower.Price,
          description: flower.Description,
          inStock: flower.in_stock
        }));
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  addFlower(id: any) {     
    this.activeModal.close({id: id})
  }

}
