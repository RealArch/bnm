import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, collectionSnapshots, doc, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private firestore: Firestore = inject(Firestore)
  constructor() { }

  getWorkersPerActive(active: boolean) {
    var usersRef = collection(getFirestore(), 'users')
    var usersRefq = query(usersRef, where("active", "==", active))

    return collectionSnapshots(usersRefq).pipe(
      map(users => users.map(user => {
        const data = user.data()
        const id = user.id
        return { id, ...data }
      }))
    )
  }
  activateDeactivate(active: boolean, uid: string) {
    var usersRef = doc(getFirestore(), 'users', uid)
    return updateDoc(usersRef, {
      active: !active
    })

  }
  updateAndActivateWorker(uid: any, firstName: string, lastName: string, hourlyRate: number) {
    const userRef = doc(getFirestore(), 'users', uid)
    return updateDoc(userRef, {
      active: true,
      firstName: firstName,
      lastName: lastName,
      hourlyRate: hourlyRate
    })
  }
  updateWorker(uid: any, formData: any) {
    const userRef = doc(getFirestore(), 'users', uid)
    return updateDoc(userRef, formData)
  }
  calculateEarnings(hoursWorked: number, hourlyRate: number) {
    // Convertir milisegundos a horas 
    const totalHoursWorked = hoursWorked / (1000 * 60 * 60);
    // Calcular el dinero adquirido 
    const earnings = hourlyRate * totalHoursWorked;
    const moneyEarned = earnings.toFixed(2);
    return moneyEarned
  }

  getUsers() {
    const usersRef = collection(getFirestore(), 'users')
    return collectionSnapshots(usersRef).pipe(
      map(users => users.map(user => {
        const data = user.data()
        const id = user.id
        return { id, ...data }
      }))
    )
  }
  getAdminUsers(){
      const usersRef = collection(getFirestore(), 'adminUsers')
    return collectionSnapshots(usersRef).pipe(
      map(users => users.map(user => {
        const data = user.data()
        const id = user.id
        return { id, ...data }
      }))
    )
  }

}
