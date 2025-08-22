import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment as globals } from "./../../environments/environment"
import { collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { WorkOrder, PaginatedWorkOrderResult } from '../interfaces/work-order';
import { algoliasearch } from 'algoliasearch';
import { environment } from 'src/environments/environment';


const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  http = inject(HttpClient)
  firestore = inject(Firestore)
  private workOrdersCollection: CollectionReference<DocumentData>;


  constructor() {
    this.workOrdersCollection = collection(this.firestore, 'workOrders');

  }

  /**
 * Envía los datos del Work Order a la API.
 * @param workOrderData Los datos del formulario.
 * @returns Un Observable con la respuesta de la API.
 */
  addWorkOrder(workOrderData: any, afAuthToken: string): Observable<any> {
    console.log(workOrderData)
    var data = {
      workOrderData,
      afAuthToken
    }
    // Realiza una petición POST a la URL de la API con los datos del formulario
    return this.http.post(`${globals.api}/work-orders/create`, data);
  }

  /**
  * Obtiene todas las órdenes de trabajo como un Observable en tiempo real.
  * Los datos se actualizarán automáticamente si cambian en Firestore.
  * @returns Un Observable con un array de órdenes de trabajo.
  */
  getAllWorkOrders(): Observable<WorkOrder[]> {
    // collectionData es la función clave de AngularFire para obtener datos en tiempo real.
    // El segundo argumento { idField: 'id' } mapea automáticamente el ID del documento
    // a una propiedad 'id' en el objeto, lo cual es una excelente práctica.
    return collectionData(this.workOrdersCollection, { idField: 'id' }) as Observable<WorkOrder[]>;
  }

  getWorkOrders_A(page: number = 0, hitsPerPage: number = 10) {
    return client.searchSingleIndex({
      indexName: environment.algolia.indexes.workOrders,
      searchParams: {
        page,
        hitsPerPage
      }
    })
  }
  getUserPendingSignWorkOrders() {
    var q = query(
      this.workOrdersCollection,
      where("workSign.img", "==", null),
      where("pickupSign.img", "==", null)
    )
    return collectionData(q, { idField: "id" })
  }

  

  
}
