import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CleaningService {

  private ChurchUrl = `${environment.apiUrl}/church`
  private FlowerUrl = `${environment.apiUrl}/flowers`
  private SubUrl = `${environment.apiUrl}/subscription`
  private BookUrl = `${environment.apiUrl}/booking`

  constructor(
    private http: HttpClient
  ) { }

  newService(itm:any){
    return this.http.post(`${this.BookUrl}/book-cleaning-service`, itm)
  }

  getAllCemetry(){
    return this.http.get(`${this.ChurchUrl}/get-church`)
  }

  getAllPlans(){
    return this.http.get(`${this.SubUrl}`)
  }

  getFlowers(){
    return this.http.get(`${this.FlowerUrl}/get-all-flower`)
  }
}
