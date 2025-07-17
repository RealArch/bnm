import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState, getAuth, getIdTokenResult, idToken, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { doc, docSnapshots, getFirestore } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { environment as globals } from './../../environments/environment'; // Import environment to use the API URL
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserUid$!: Observable<string | null>;

  constructor(
    private auth: Auth, //Esto es necesario para hacer funcionar el servicio en standalone
    private http: HttpClient,
  ) {
    // Escucha los cambios en el estado de autenticación de Firebase
    // y mapea el objeto User (o null) a solo su UID (o null)
    this.currentUserUid$ = authState(this.auth).pipe(
      map((user: User | null) => user ? user.uid : null)
    );
  }

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
    const url = `${globals.api}/auth/addAdminUser`; // Construye la URL completa de la ruta
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
  deleteAdminUser(userId: string) {
    const url = `${globals.api}/auth/adminUsers/${userId}`; // Construye la URL completa de la ruta
    return this.http.delete(url);
  }
  isCurrentUser(targetUid: string): Observable<boolean | null> {
    return this.currentUserUid$.pipe(
      map(currentUid => {
        if (currentUid === null) {
          return null; // No hay usuario logueado para comparar
        }
        return currentUid === targetUid;
      })
    );
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

  /////////////
}
