import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState, getAuth, getIdTokenResult, idToken, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, docSnapshots, getFirestore } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { environment as globals } from './../../environments/environment'; // Import environment to use the API URL
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

  /**
 * Envía una solicitud POST para crear un nuevo usuario.
 * @param userData Un objeto con las propiedades email y password.
 * @returns Un Observable que emite la respuesta del servidor.
 */
  addAdminUser(userData: {
    email: string;
    password: string;
    name: string;
    lastName: string
  }): Observable<any> {
    const url = `${globals}/auth/addAdminUser`; // Construye la URL completa de la ruta
    return this.http.post<any>(url, userData);
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
