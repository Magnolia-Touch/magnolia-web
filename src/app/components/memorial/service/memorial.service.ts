import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemorialService {

  private BaseUrl = `${environment.apiUrl}/memories`

  constructor(
    private http: HttpClient
  ) { }

  createMemorial(itm: any) {
    return this.http.post(`${this.BaseUrl}/create-memorial-profile`, itm)
  }

  getMemorial(code: string) {
    return this.http.get(`${this.BaseUrl}?code=${code}`)
  }

  addGuestBook(itm: any, code: any) {
    return this.http.post(`${this.BaseUrl}/add-guestbook?code=${code}`, itm)
  }

  deleteGuestBook(code: string, id: any) {
    return this.http.get(`${this.BaseUrl}/delete-guestmessages?code=${code}&id=${id}`)
  }

  updateGuestBookStatus(code: string, id: any) {
    return this.http.patch(`${this.BaseUrl}/approve-guestmessages?code=${code}&id=${id}`, {})
  }

  approveGuestBook(code: any) {
    return this.http.get(`${this.BaseUrl}/guestmessages?code=${code}`)
  }

  UnApproveGuestBook(code: any) {
    return this.http.get(`${this.BaseUrl}/unapproved-guestmessages?code=${code}`)
  }
}
