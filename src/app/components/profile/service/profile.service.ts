import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BaseUrl = `${environment.apiUrl}/auth`
  private SubUrl = `${environment.apiUrl}/user`

  constructor(
    private http: HttpClient
  ) { }

  getUserProfile() {
    return this.http.get(`${this.BaseUrl}/profile`)
  }

  updateUserProfile(itm: any) {
    return this.http.put(`${this.BaseUrl}/profile`, itm)
  }

  getActiveSubs() {
    return this.http.get(`${this.SubUrl}/get-active-subscriptions`)
  }
}
