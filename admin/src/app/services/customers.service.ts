import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionSnapshots, deleteDoc, doc, Firestore, getFirestore, serverTimestamp, setDoc, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { getAuth } from '@angular/fire/auth';
import { AddCustomer, Customer } from '../interfaces/customers'
import { map, Observable } from 'rxjs';
import { algoliasearch } from 'algoliasearch';
import { environment } from './../../environments/environment';

const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private firestore: Firestore = inject(Firestore)

  constructor(
    private authService: AuthService
  ) { }

  getAllCustomers(): Observable<Customer[]> {
    var ref = collection(getFirestore(), 'customers')
    return collectionSnapshots(ref).pipe(
      map(customers => customers.map(customer => {
        {
          const data = customer.data();
          const id = customer.id;

          return { id, ...data } as Customer

        }
      })))
  }
  async searchCustomer(value: string): Promise<Customer[]> {
    try {
      client.clearCache()
      const response = await client.searchSingleIndex({
        indexName: environment.algolia.indexes.customers,
        searchParams: { query: value },

      });

      console.log(response);

      return response.hits.map((result) => this.mapToCustomer(result));

    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  removeCustomer(customerId: string) {
    var ref = doc(getFirestore(), 'customers', customerId)
    return deleteDoc(ref)
  }
  addCustomer(data: AddCustomer) {
    console.log(data.id)
    // var idToken = await getAuth().currentUser?.getIdToken(true)
    const firestore = getFirestore()
    const id = data.id ?? doc(collection(firestore, 'customers')).id; // Usa el ID proporcionado o genera uno nuevo
    console.log(id)
    var ref = doc(firestore, 'customers/', id)
    return setDoc(ref, {
      ...data,
      creationDate: serverTimestamp(),
    }, { merge: true })
  }
  private mapToCustomer(hit: any): Customer {
    return {
      id: hit.objectID,  // Algolia devuelve objectID como identificador
      companyName: hit.companyName || 'N/A',
      companyPhone: hit.companyPhone || 'N/A',
      companyAddress: hit.companyAddress || 'N/A',
      contactName: hit.contactName || 'N/A',
      contactPhone: hit.contactPhone || 'N/A',
      creationDate: hit.creationDate || 'N/A'
    };
  }
}
