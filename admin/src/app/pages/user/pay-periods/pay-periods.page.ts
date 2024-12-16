import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
import { UserAccordionPage } from './user-accordion/user-accordion.page';
import { UsersService } from 'src/app/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pay-periods',
  templateUrl: './pay-periods.page.html',
  styleUrls: ['./pay-periods.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserAccordionPage]
})
export class PayPeriodsPage implements OnInit {
  usersService = inject(UsersService)
  private unsubscribe$ = new Subject<void>();
  usersData: { id: string; }[] = [];
  loading: boolean = true;
  constructor() {
    addIcons({ ellipsisVertical })
  }

  ngOnInit() {
    this.readUsers()
  }
  preventDefault(event: Event) {
    event.stopPropagation(); // Evitar que el evento afecte el acordeón }

  }
  readUsers() {
    this.loading = true;
    this.usersService.getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resUserData) => {
          this.usersData = resUserData;
          this.loading = false;
        },
        error: (e) => {
          console.log(e)
        }
      })
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete()
  }
}