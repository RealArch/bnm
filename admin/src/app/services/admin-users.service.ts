import { inject, Injectable } from '@angular/core';
import { environment as globals } from './../../environments/environment'; // Import environment to use the API URL
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  http = inject(HttpClient)
  constructor() { }


  activateDeactivateUser(userId: string, newStatus: boolean) {
    var userData = {
      newStatus: newStatus,
      userId: userId
    }
    const url = `${globals.api}/auth/adminUsers/changeStatus`; // Construye la URL completa de la ruta
    return this.http.patch<any>(url, userData);
  }
}
