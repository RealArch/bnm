import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Auth, authState, getIdToken, sendPasswordResetEmail, signInWithCustomToken, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Firestore, deleteDoc, doc, docData, docSnapshots, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators'; // 👈 mejor desde 'rxjs/operators'
import { PublicConfig } from 'src/app/interfaces/public-config';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private injector = inject(Injector);

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private http: HttpClient,
    private router: Router,
    private navController: NavController
  ) { }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithToken(loginToken: string) {
    return signInWithCustomToken(this.auth, loginToken);
  }

  signup(registerForm: any) {
    return this.http.post(`${environment.api}/auth/signup`, registerForm);
  }

  getAuthState() {
    return authState(this.auth);
  }

  getPublicConfigData() {
    return runInInjectionContext(this.injector, () => {

      const ref = doc(this.firestore, 'general', 'settings');
      return docSnapshots(ref).pipe(
        map(snapshot => snapshot.data() as PublicConfig)
      );
    });
  }

  logout() {
    localStorage.removeItem('userUid');
    this.navController.navigateRoot("/auth/login");
    return signOut(this.auth);
  }

  async getIdToken() {
    const user$ = user(this.auth); // observable gestionado por AngularFire
    const currentUser = await firstValueFrom(user$);
    return currentUser ? getIdToken(currentUser, true) : null;
  }

  getUserData(userUid: string) {
    return runInInjectionContext(this.injector, () => {

      const ref = doc(this.firestore, 'users', userUid);
      return docSnapshots(ref).pipe(
        map(snapshot => ({
          id: snapshot.id,
          ...snapshot.data()
        }))
      );
    });

  }

  deleteAccount(userUid: string, afAuthToken: string) {
    return this.http.post(`${environment.api}/auth/deleteAccount`, { userUid, afAuthToken });
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

    /**
     * Obtiene el UID del usuario actualmente logueado
     */
    async getCurrentUserUid(): Promise<string | null> {
      const user$ = user(this.auth);
      const currentUser = await firstValueFrom(user$);
      return currentUser ? currentUser.uid : null;
    }
}
