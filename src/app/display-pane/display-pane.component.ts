import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';

@Component({
  selector: 'display-pane',
  templateUrl: './display-pane.component.html',
  styleUrls: ['./display-pane.component.scss']
})
export class DisplayPaneComponent implements OnInit {
  messageLoaded = false;
  message: any;

  constructor() { }

  ngOnInit() {
  }

}
