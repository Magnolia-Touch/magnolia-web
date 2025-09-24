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
}
