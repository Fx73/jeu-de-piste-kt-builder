import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'New', url: '/New', icon: 'add' },
    { title: 'Recent', url: '/Recent', icon: 'time' },
    { title: 'Save', url: '/Save', icon: 'save' },
    { title: 'Export', url: '/Export', icon: 'archive' },
    { title: 'Import', url: '/Import', icon: 'download' },
    { title: 'Remove', url: '/Remove', icon: 'trash' },
    { title: 'Account', url: '/Account', icon: 'heart' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
