import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth //Esto es necesario para hacer funcionar el servicio en standalone
  ) { }

  login(email: string, password: string) {
    console.log(email)
    return signInWithEmailAndPassword(getAuth(), email, password)
  }
}
