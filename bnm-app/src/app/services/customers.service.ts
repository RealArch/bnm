import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, getFirestore } from '@angular/fire/firestore';
import { algoliasearch } from 'algoliasearch';
import { environment } from './../../environments/environment';
import { Customer } from '../interfaces/customers';

const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private firestore:Firestore
  ) { }

  getAllCustomers() {
    const ref = collection(this.firestore, 'customers')
    return getDocs(ref)
  }
  async getAllCustomersAlgolia() {
    try {
      client.clearCache()
      const response = await client.searchSingleIndex({
        indexName: environment.algolia.indexes.customers,
        // searchParams: { query: value },

      });
      
      return response.hits.map((result) => this.mapToCustomer(result));

    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
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
