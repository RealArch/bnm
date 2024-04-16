import { Injectable } from '@angular/core';
import { Auth, IdTokenResult, authState, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
}
