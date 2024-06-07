import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StatusCardComponent } from 'src/app/components/status-card/status-card.component';
import { addIcons } from 'ionicons';
import { notifications } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { PopupsService } from 'src/app/services/popups.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, StatusCardComponent]
})
export class DashboardPage implements OnInit {
  subscriptions!: Subscription[];
  loadingData: boolean = true;
  userUid: string;
  userData: any;
  constructor(
    private authService: AuthService,
    private popupService: PopupsService,


  ) {
    addIcons({ notifications })
    this.userUid = localStorage.getItem('userUid')!
  }

  ngOnInit() {
    this.getUserData()
  }

  getUserData() {
    this.loadingData = true
    this.authService.getUserData(this.userUid)
      .subscribe({
        next: (user) => {
          this.userData = user.data()
          console.log(this.userData)
          this.loadingData=false
        },
        error: (e) => {
          this.loadingData = false
          this.popupService.presentToast('bottom', 'danger', 'An error occurred while reading your data.')
        }
      })

  }
  logout() {
    this.authService.logout()
  }
  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe()
    });
  }
}
