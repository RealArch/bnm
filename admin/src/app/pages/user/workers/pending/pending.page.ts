import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, home } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ItemUserComponent } from 'src/app/components/item-user/item-user.component';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.page.html',
  styleUrls: ['./pending.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ItemUserComponent]
})
export class PendingPage implements OnInit {
  usersService = inject(UsersService)
  loading: boolean = true;
  users: any;
  subscriptions: Subscription[] = []
  constructor() {
    addIcons({ home, ellipsisVertical })
  }

  ngOnInit() {
    this.getData()

  }
  getData() {
    this.subscriptions.push(this.usersService.getWorkersPerActive(false)
      .subscribe({
        next: ((users: any[]) => {
          this.users = users
          console.log(users)
          this.loading = false

        }),
        error: ((err: any) => {

        }),
        complete: () => {
        }
      })
    )
  }
  ngOnDestroy() {
    console.log('destrui')
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
