import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private BaseUrl = `${environment.apiUrl}/contact-form`

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(itm: any) {
    return this.http.post(`${this.BaseUrl}`, itm)
  }
}
