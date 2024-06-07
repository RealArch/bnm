import { Injectable } from '@angular/core';
import { Auth, IdTokenResult, authState, getAuth, getIdToken, idToken, signInWithCustomToken, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { idTokenResult } from '@angular/fire/auth-guard';
import { Firestore, doc, docSnapshots, getDoc, getFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebase: Firestore,
    private auth: Auth, //Esto es necesario para hacer funcionar el servicio en standalone
    private http: HttpClient,

  ) { }

  login(email: string, password: string) {
    console.log(email)
    console.log(password)
    return signInWithEmailAndPassword(getAuth(), email, password)
  }
  loginWithToken(loginToken: string) {
    return signInWithCustomToken(getAuth(), loginToken)
  }
  signup(registerForm: any) {
    var data = {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password,
    }
    return this.http.post(`${environment.api}/auth/signup`, data)
  }
  getAuthState() {
    return authState(getAuth())
  }
  logout() {
    return signOut(getAuth())
  }
  async getIdToken() {
    // var token = await this.auth.currentUser?.getIdToken(true)
    // return token
    const user = this.auth.currentUser;
    var token = user ? await user.getIdToken(true) : null;
    return token;
  }
  getUserData(userUid: string) {
    var ref = doc(getFirestore(), 'users', userUid)
    return docSnapshots(ref)
  }


}
