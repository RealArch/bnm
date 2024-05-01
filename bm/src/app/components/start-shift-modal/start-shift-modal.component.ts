import { Component, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-start-shift-modal',
  templateUrl: './start-shift-modal.component.html',
  styleUrls: ['./start-shift-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class StartShiftModalComponent implements OnInit {
  dateNow: string = '15:45';
  constructor(
    private modal: IonModal
  ) { }

  ngOnInit() {
    // this.dateNow = this.getCurrentIso8601Date()
    console.log(this.dateNow)

  }
  cancel() {
    this.getCurrentIso8601Date()
    this.modal.dismiss(null, 'cancel');
  }
  getCurrentIso8601Date() {
    const currentDate = new Date(Date.now());
    const isoString = currentDate.toISOString();
    return isoString
  }
}
