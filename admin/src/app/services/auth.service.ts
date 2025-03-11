import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState, getAuth, getIdTokenResult, idToken, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, docSnapshots, getFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth, //Esto es necesario para hacer funcionar el servicio en standalone
    private http: HttpClient,
  ) { }

  login(email: string, password: string) {
    console.log(email)
    console.log(password)
    return signInWithEmailAndPassword(getAuth(), email, password)
  }
  getPublicConfigData() {
    var ref = doc(getFirestore(), 'general', 'settings')
    return docSnapshots(ref).pipe(
      map(snapshot => ({
        ...snapshot.data()
      } as any))
    )
  }
  
  getAuthState() {
    return authState(getAuth())
  }
  async getIdTokenResult() {
    return await getAuth().currentUser?.getIdTokenResult()
  }
  async isAdmin() {
    var idToken = await getAuth().currentUser?.getIdToken()
    if (idToken) {
      
    } else {
      return false
    }
    return
  }

  logOut() {
    return signOut(getAuth())
  }
}
