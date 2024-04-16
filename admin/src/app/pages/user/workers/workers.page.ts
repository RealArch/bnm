import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationEnd, Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.page.html',
  styleUrls: ['./workers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref]
})
export class WorkersPage implements OnInit {
  router = inject(Router)
  active: any
  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //const url = event.urlAfterRedirects;
        // Procesa la nueva URL
        const parts = event.urlAfterRedirects.split("/");
        const lastValue = parts[parts.length - 1];
        this.active = lastValue
      }
    });
  }

}
