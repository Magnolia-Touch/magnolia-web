import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BaseUrl = `${environment.apiUrl}/auth`

  constructor(
    private http: HttpClient
  ) { }

  getUserProfile() {
    return this.http.get(`${this.BaseUrl}/profile`)
  }
}
