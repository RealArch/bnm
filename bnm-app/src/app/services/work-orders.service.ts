import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment as globals} from "./../../environments/environment"
@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {

  constructor() { }
  http = inject(HttpClient)
    /**
   * Envía los datos del nuevo Work Order a la API.
   * @param workOrderData Los datos del formulario.
   * @returns Un Observable con la respuesta de la API.
   */
  addWorkOrder(workOrderData: any, afAuthToken:string): Observable<any> {
    var data={
      workOrderData,
      afAuthToken
    }
    // Realiza una petición POST a la URL de la API con los datos del formulario
    return this.http.post(`${globals.api}/work-orders/create` , data);
  }
}
