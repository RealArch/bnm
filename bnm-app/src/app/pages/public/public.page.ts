import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
    selector: 'app-public',
    templateUrl: './public.page.html',
    styleUrls: ['./public.page.scss'],
    imports: [FormsModule, IONIC_STANDALONE_MODULES]
})
export class PublicPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
