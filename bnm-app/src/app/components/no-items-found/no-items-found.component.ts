import { i } from '@angular/cdk/data-source.d-Bblv7Zvh';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-items-found',
  templateUrl: './no-items-found.component.html',
  styleUrls: ['./no-items-found.component.scss'],
})
export class NoItemsFoundComponent  implements OnInit {
  //input text
  @Input() message: string = 'No items found.';
  constructor() { }

  ngOnInit() {}

}
