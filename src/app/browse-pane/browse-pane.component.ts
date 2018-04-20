import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'browse-pane',
  templateUrl: './browse-pane.component.html',
  styleUrls: ['./browse-pane.component.scss']
})
export class BrowsePaneComponent implements OnInit {

  messages = []
  
  constructor() { }

  ngOnInit() {
  }

}
