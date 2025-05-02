import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLinkWithHref } from '@angular/router';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.page.html',
  styleUrls: ['./workers.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLinkWithHref, IONIC_STANDALONE_MODULES]
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
