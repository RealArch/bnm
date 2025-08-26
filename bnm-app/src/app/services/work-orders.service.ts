import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment as globals } from "./../../environments/environment"
import { collection, collectionData, CollectionReference, doc, DocumentData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { WorkOrder, PaginatedWorkOrderResult } from '../interfaces/work-order';
import { algoliasearch } from 'algoliasearch';
import { environment } from 'src/environments/environment';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';


const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  http = inject(HttpClient)
  firestore = inject(Firestore)
  private storage = getStorage();
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

  /**
   * Sube la imagen de la firma a Firebase Storage y actualiza el documento en Firestore.
   * @param workOrderId - El ID del documento de la orden de trabajo.
   * @param type - El tipo de orden ('work' o 'pickup').
   * @param dataUrl - La firma en formato Base64 Data URL.
   * @returns La URL de descarga de la imagen subida.
   */
  async uploadSignature(workOrderId: string, type: 'work' | 'pickup', dataUrl: string): Promise<string> {
    try {
      // 1. Crear una referencia única en Firebase Storage
      const filePath = `signatures/${workOrderId}_${type}_${new Date().getTime()}.png`;
      const storageRef = ref(this.storage, filePath);

      // 2. Subir la imagen (en formato data_url)
      console.log('Subiendo firma a Firebase Storage...');
      const uploadResult = await uploadString(storageRef, dataUrl, 'data_url');
      
      // 3. Obtener la URL de descarga
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Firma subida. URL:', downloadURL);

      // 4. Determinar qué campo actualizar en Firestore
      const fieldToUpdate = type === 'work' ? 'workSign.img' : 'pickupSign.img';
      
      // 5. Crear el objeto de actualización con notación de corchetes para el campo dinámico
      const updateData = { [fieldToUpdate]: downloadURL };

      // 6. Actualizar el documento en Firestore
      const docRef = doc(this.firestore, 'workOrders', workOrderId);
      await updateDoc(docRef, updateData);
      console.log(`Documento ${workOrderId} actualizado correctamente.`);

      return downloadURL;
    } catch (error) {
      console.error("Error al subir la firma o actualizar el documento:", error);
      // Propagar el error para que el componente que llama pueda manejarlo
      throw new Error('No se pudo guardar la firma. Inténtalo de nuevo.');
    }
  }

  

  
}
