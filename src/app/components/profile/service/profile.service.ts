import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BaseUrl = `${environment.apiUrl}/auth`
  private SubUrl = `${environment.apiUrl}/user`
  private MemoUrl = `${environment.apiUrl}/memories`

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

  getMemorials(page: number, limit: number, search: string = '') {
    let params: any = { page, limit };
    if (search) {
      params.search = search;
    }

    return this.http.get(`${this.MemoUrl}/profiles`, { params })
  }

  changePassword(data: { oldPassword: string, newPassword: string, confirmPassword: string }) {
    return this.http.post(`${this.BaseUrl}/change-password`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.BaseUrl}/forgot-password`, { email });
  }

  resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return this.http.post(`${this.BaseUrl}/reset-password`, data);
  }

}
