import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionSnapshots, deleteDoc, doc, Firestore, getFirestore, serverTimestamp, setDoc, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { getAuth } from '@angular/fire/auth';
import { AddCustomer, Customer } from '../interfaces/customers'
import { map, Observable } from 'rxjs';

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
  removeCustomer(customerId: string) {
    var ref = doc(getFirestore(), 'customers', customerId)
    return deleteDoc(ref)
  }
  addCustomer(data: AddCustomer) {
    // var idToken = await getAuth().currentUser?.getIdToken(true)
    var ref = collection(getFirestore(), 'customers/')
    return addDoc(ref, {
      ...data,
      creationDate: serverTimestamp(),
    })
  }

}
// companyName:string,
// companyPhone:string,
// companyAddress:string,
// contactName:string,
// contactPhone:string,