import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, Query, runInInjectionContext } from '@angular/core';
import { catchError, from, map, Observable, of, take } from 'rxjs';
import { environment as globals } from "./../../environments/environment"
import { arrayUnion, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, getDoc, limit, query, serverTimestamp, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { WorkOrder, PaginatedWorkOrderResult, workOrderStatus, workOrderSignType } from '../interfaces/work-order';
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
    this.workOrdersCollection = collection(this.firestore, 'workOrders') as CollectionReference<WorkOrder>;

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

  getWorkOrderById(id: string): Observable<WorkOrder | null> {
    const docRef = doc(this.workOrdersCollection, id);
    console.log(id)
    return docData(docRef, { idField: 'id' }) as Observable<WorkOrder | null>;
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

  getUserWorkOrders(status: workOrderStatus, maxResults?: number): Observable<WorkOrder[]> {
    return runInInjectionContext(this.injector, () => {
      // Creamos un arreglo de constraints
      const constraints: any[] = [where("status", "==", status)];

      if (maxResults) {
        constraints.push(limit(maxResults));
      }

      // Pasamos todos los constraints juntos
      const q = query(this.workOrdersCollection, ...constraints);

      return collectionData(q, { idField: "id" }) as Observable<WorkOrder[]>;
    });
  }
  getWorkOrdersFiltered(params: {
    page?: number,
    hitsPerPage?: number,
    query?: string, // búsqueda de texto
    createdByUid?: string,
    customerId?: string,
    status?: string,
    type?: string,
    startDate?: string, // ISO string
    closeDate?: string  // ISO string
  }) {
    console.log(params)
    const {
      page = 0,
      hitsPerPage = 10,
      query = '',
      createdByUid,
      customerId,
      status,
      type,
      startDate,
      closeDate
    } = params;

    // Construimos los filtros de Algolia
    const filters: string[] = [];

    if (createdByUid) filters.push(`createdBy.uid:"${createdByUid}"`);
    if (customerId) filters.push(`customer.id:"${customerId}"`);
    if (status) filters.push(`status:"${status}"`);
    if (type) filters.push(`type:"${type}"`);
    if (startDate && closeDate) {
      // Algolia espera rango en formato [valor TO valor]
      filters.push(`startDate:[${startDate} TO ${closeDate}]`);
    } else if (startDate) {
      filters.push(`startDate >= ${startDate}`);
    } else if (closeDate) {
      filters.push(`closeDate <= ${closeDate}`);
    }
    const filterString = filters.join(' AND ');
    console.log(filterString)

    client.clearCache()
    return client.searchSingleIndex({
      indexName: environment.algolia.indexes.workOrders,
      searchParams: {
        page,
        hitsPerPage,
        query,
        filters: filterString || undefined
      }
    });
  }


  async removeWorkOrder(id: string): Promise<void> {
    const docRef = doc(this.workOrdersCollection, id);
    await deleteDoc(docRef);
  }

  async uploadSignature(signatureDataURL: string, workOrderId: string, workOrdertype: 'work' | 'pickup', signType: workOrderSignType, newMaterialsUsed: any[], newServicesPerformed: any[], closeDate: string | null = null) {

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
      const filePath = `signatures/${workOrdertype}_${workOrderId}_${Date.now()}.png`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      // Actualizar Firestore
      const docRef = doc(this.firestore, `workOrders/${workOrderId}`);
      const updateData: any = {};
      if (signType === 'closeSign') {
        updateData['closeSign.img'] = url;
        updateData['closeSign.imgName'] = filePath;
        updateData['closeSign.dateSigned'] = serverTimestamp();
        updateData['closeSign.requestedBy'] = user.uid;
        updateData['status'] = 'closed';
      } else if (signType === 'openSign') {
        updateData['openSign.img'] = url;
        updateData['openSign.imgName'] = filePath;
        updateData['openSign.dateSigned'] = serverTimestamp();
        updateData['openSign.requestedBy'] = user.uid;
        updateData['status'] = 'in-progress';
      }
      //  Si hay materiales nuevos, agregarlos sin sobrescribir
      if (newMaterialsUsed && newMaterialsUsed.length > 0) {
        updateData['materialsUsed'] = arrayUnion(...newMaterialsUsed);
      }

      //  Si hay servicios nuevos, agregarlos sin sobrescribir
      if (newServicesPerformed && newServicesPerformed.length > 0) {
        updateData['servicesPerformed'] = arrayUnion(...newServicesPerformed);
      }
      // Si closeDate no es null, agregarlo a los datos de actualización como un timestamp basado en closeDate
      if (closeDate) {

        updateData['closeDate'] = closeDate;
      }

      //
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
