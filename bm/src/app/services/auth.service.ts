import { Injectable } from '@angular/core';
import { Auth, IdTokenResult, authState, getAuth, getIdToken, idToken, onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { idTokenResult } from '@angular/fire/auth-guard';
import { Firestore, doc, docSnapshots, getDoc, getFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebase: Firestore,
    private auth: Auth, //Esto es necesario para hacer funcionar el servicio en standalone
    private http: HttpClient,
    private router:Router,
    private navController:NavController

  ) { }

  login(email: string, password: string) {
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
    localStorage.removeItem('userUid')
    // this.router.navigate(["/auth/login"])
    this.navController.navigateRoot("/auth/login")

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
