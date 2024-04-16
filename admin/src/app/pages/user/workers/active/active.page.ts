import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, home } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { ItemUserComponent } from "../../../../components/item-user/item-user.component";

@Component({
  selector: 'app-active',
  templateUrl: './active.page.html',
  styleUrls: ['./active.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ItemUserComponent]
})
export class ActivePage implements OnInit {
  usersService = inject(UsersService)
  loading: boolean = true
  subscriptions: Subscription[] = []
  users: any
  constructor() {
    addIcons({ home, ellipsisVertical })
  }

  ngOnInit() {
    this.getData()
  }
  getData() {
    this.subscriptions.push(this.usersService.getWorkersPerActive(true)
      .subscribe({
        next: ((users: any[]) => {
          this.users = users
          console.log(users.length)
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
