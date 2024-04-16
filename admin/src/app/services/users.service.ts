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
}
