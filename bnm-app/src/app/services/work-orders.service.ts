import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment as globals } from "./../../environments/environment"
import { collection, collectionData, CollectionReference, doc, DocumentData, Firestore, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { WorkOrder, PaginatedWorkOrderResult } from '../interfaces/work-order';
import { algoliasearch } from 'algoliasearch';
import { environment } from 'src/environments/environment';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Storage, uploadBytes } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';


const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  http = inject(HttpClient)
  firestore = inject(Firestore)
  auth = inject(Auth)
  private storage = getStorage();
  _storage = inject(Storage);
  private workOrdersCollection: CollectionReference<DocumentData>;
  private injector = inject(Injector);

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
    return runInInjectionContext(this.injector, () => {
      var q = query(
        this.workOrdersCollection,
        where("workSign.img", "==", null),
        where("pickupSign.img", "==", null)
      )
      return collectionData(q, { idField: "id" })
    });
  }

  async uploadSignature(signatureDataURL: string, workOrderId: string, type: 'work' | 'pickup') {
    try {
            // 1. Obtener el usuario actual de Firebase Auth
      const user = this.auth.currentUser;

      // 2. Validar que el usuario esté autenticado antes de continuar
      if (!user) {
        throw new Error('Usuario no autenticado. No se puede subir la firma.');
      }

      // Convertir base64 a Blob
      const blob = this.base64ToBlob(signatureDataURL);

      // Subir a Firebase Storage
      const filePath = `signatures/${type}_${workOrderId}_${Date.now()}.png`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      // Actualizar Firestore
      const docRef = doc(this.firestore, `workOrders/${workOrderId}`);
      const updateData: any = {};
      if (type === 'work') {
        updateData['workSign.img'] = url;
        updateData['workSign.imgName'] = filePath;
        updateData['workSign.dateSigned'] = serverTimestamp();
        updateData['workSign.requestedBy'] = user.uid;
      } else if (type === 'pickup') {
        updateData['pickupSign.img'] = url;
        updateData['pickupSign.imgName'] = filePath;
        updateData['pickupSign.dateSigned'] = serverTimestamp();
        updateData['pickupSign.requestedBy'] = user.uid;
      }
      return await updateDoc(docRef, updateData);

    } catch (error) {
      console.error('Error al subir firma:', error);
      return error;
    }
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }




}
