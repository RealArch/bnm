import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as global } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(
    private http: HttpClient
  ) { }

  startShift(startTime: number, type: 'working' | 'traveling' | 'other', workingPlace: string, details: string, afAuthToken: string | null) {
    var data = {
      startTime: startTime,
      type: type,
      workingPlace: workingPlace,
      details: details,
      afAuthToken
    }
    return this.http.post(`${global.api}/shifts/start`, data)
  }
}
