import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, people, logOut, business, settings, reader } from 'ionicons/icons'
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil, firstValueFrom } from 'rxjs';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { PopupService } from 'src/app/services/popup.service';
import { NavController } from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLinkWithHref, RouterLinkActive, IONIC_STANDALONE_MODULES],
})
export class UserPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  menuController = inject(MenuController)
  navController = inject(NavController)
  popupService = inject(PopupService)
  usersService = inject(UsersService)
  private unsubscribe$ = new Subject<void>();
  currentUser: any = null;
  constructor() {
    addIcons({ home, people, logOut, business, settings, reader })
    this.authService.getAuthState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user: any) => {
          if (user) {
            this.authService.getIdTokenResult()?.then(data => {
              if (!data?.claims['admin'] || !data?.claims['active']) {
                this.popupService.presentToast(
                  'bottom',
                  'danger',
                  'Access denied for this module.'
                )
                this.navController.navigateRoot('/auth/login')
                this.logOut()
              }
            })
          } else {
            this.navController.navigateRoot('/auth/login')
          }
        }
      })
  }

  ngOnInit() {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const authState = await firstValueFrom(this.authService.getAuthState());
      if (authState) {
        const userId = authState.uid;

        // Buscar primero en adminUsers
        const adminUsers = await firstValueFrom(this.usersService.getAdminUsers());
        let user = adminUsers?.find((u: any) => u.id === userId);

        if (user) {
          this.currentUser = user;
        }
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';

    const firstName = this.currentUser.name || this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';

    const hasFirstName = firstName.trim().length > 0;
    const hasLastName = lastName.trim().length > 0;

    if (!hasFirstName && !hasLastName) return 'U';

    const firstInitial = hasFirstName ? firstName.trim().charAt(0).toUpperCase() : '';
    const lastInitial = hasLastName ? lastName.trim().charAt(0).toUpperCase() : '';

    return (firstInitial + lastInitial) || 'U';
  }

  getUserFullName(): string {
    if (!this.currentUser) return 'Loading...';

    const firstName = this.currentUser.name || this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';

    const hasFirstName = firstName.trim().length > 0;
    const hasLastName = lastName.trim().length > 0;

    if (!hasFirstName && !hasLastName) return 'N/A';

    const fullName = `${hasFirstName ? firstName.trim() : 'N/A'} ${hasLastName ? lastName.trim() : ''}`.trim();
    return fullName;
  }

  getUserEmail(): string {
    if (!this.currentUser) return 'Loading...';

    const email = this.currentUser.email || '';
    return email.trim().length > 0 ? email.trim() : 'No email available';
  }
  closeModal() {
    this.menuController.close('main')
    console.log('cerrando')
  }
  logOut() {
    this.authService.logOut()
    //Send a notification that you were logged out
  }
  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}



