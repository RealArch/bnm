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
import { HoursWorkedCardComponent } from 'src/app/components/hours-worked-card/hours-worked-card.component';
import { MoneyEarnedCardComponent } from 'src/app/components/money-earned-card/money-earned-card.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    imports: [IonicModule, CommonModule, FormsModule, StatusCardComponent, HoursWorkedCardComponent, MoneyEarnedCardComponent]
})
export class DashboardPage implements OnInit {
  subscriptions: Subscription[] = [];
  loadingData: boolean = true;
  userUid: any;
  userData: any;
  totalPaycheckHours: any;
  constructor(
    private authService: AuthService,
    private popupService: PopupsService,


  ) {
    addIcons({ notifications })

  }

  ngOnInit() {
    console.log(44)

    this.getUserData()
  }

  getUserData() {
    this.userUid = localStorage.getItem('userUid')
    console.log(this.userUid)
    this.loadingData = true
    this.subscriptions.push(
      this.authService.getUserData(this.userUid)
        .subscribe({
          next: (user) => {
            this.userData = user
            this.totalPaycheckHours = this.calculateWorkedHours(this.userData.currentPaycheck)
            this.loadingData = false
          },
          error: (e) => {
            this.loadingData = false
            this.popupService.presentToast('bottom', 'danger', 'An error occurred while reading your data.')
          }
        })
    )


  }
  calculateWorkedHours(currentPaycheck: any) {
    
    let totalWorkHours = 0;
    let totalLunchHours = 0;
    currentPaycheck.forEach((paycheck: { timeWorked: { work: number; lunch: number; }; }) => {
      totalWorkHours += paycheck.timeWorked.work; totalLunchHours += paycheck.timeWorked.lunch;
    });
    return { totalWorkHours, totalLunchHours };
  }

  ngOnDestroy() {
    console.log('destroy')
    this.subscriptions.forEach(element => {
      element.unsubscribe()
    });
  }
}
