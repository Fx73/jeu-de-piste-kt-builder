import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public menuItems = [
    { title: 'New', method: this.newFile, icon: 'add' },
    { title: 'Open', method: this.openFile, icon: 'download' },
    { title: 'Save', method: this.saveFile, icon: 'save' },
    { title: 'Export', method: this.exportFile, icon: 'archive' },
    //{ title: 'Import', method: '/Import', icon: 'download' },
    { title: 'Account', method: '/Account', icon: 'heart' },
  ];

  constructor(private chooser: Chooser) {}


  newFile(){
    console.log('New');
  }

  openFile(){
    console.log('Open');
  }

  saveFile(){
    console.log('Save');
  }

  exportFile(){
    console.log('Export');
  }

  pickFile(){
    this.chooser.getFile()
  .then(file => console.log(file ? file.name : 'canceled'))
  .catch((error: any) => console.error(error));
  }


}
