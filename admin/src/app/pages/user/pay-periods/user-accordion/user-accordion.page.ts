import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-user-accordion',
  templateUrl: './user-accordion.page.html',
  styleUrls: ['./user-accordion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserAccordionPage implements OnInit {
  @Input() userData: any;
  schedule: any;
  constructor(
    private generalServioce: GeneralService
  ) { }

  ngOnInit() {
    console.log(this.userData)
    this.schedule = this.getArrayWithSchedule()
    console.log(this.schedule)
  }
  getArrayWithSchedule() {
    //First
    return this.generalServioce.createFortnightArray('biweekly', 1735300800000, this.userData.currentPaycheck)


  }

}
