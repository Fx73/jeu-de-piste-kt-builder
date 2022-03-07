import * as JSZip from 'jszip';

import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { Scenario } from './edition/game/scenario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public menuItems = [
    { title: 'New', method: this.newFile, icon: 'add' },
    { title: 'Open', method: this.openFile, icon: 'folder-open' },
    { title: 'Save', method: this.saveFile, icon: 'save' },
    { title: 'Export', method: this.exportFile, icon: 'archive' },
    { title: 'Import', method: this.importFile, icon: 'download' },
    { title: 'Account', method: '/Account', icon: 'heart' },
    { title: 'Help', method: this.help, icon: 'information-circle' },

  ];

  constructor(
    private router: Router
    ) {}


    //#region menu items
  newFile(){
    Scenario.set(new Scenario('','','',''));
    this.router.navigateByUrl('/Edition/new');

  }

  openFile(){
    const s = localStorage.getItem('currentScenario');
    const a = localStorage.getItem('currentImages');
    this.loadScenarionFromJson(s);
    this.loadImagesFromJson(a);
    this.router.navigateByUrl('/Edition/'+Scenario.get().title);
    }

  saveFile(){
    localStorage.setItem('currentScenario', this.saveScenarioInJson());
    localStorage.setItem('currentImages', this.saveImagesInJson());

    console.log(this.saveScenarioInJson());
  }

  exportFile(){
    if(Scenario.get() == null){return;}

    const json = this.saveScenarioInJson();
    this.zipScenario(json);
  }

  importFile(){
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      this.unZipScenario((e.target as HTMLInputElement).files[0]);
   };

    input.click();
  }

  help(){
    this.router.navigate(['/Help']);
  }
  //#endregion

//#region utilities
  loadScenarionFromJson(json: string){
    const s = Object.assign(new Scenario('','','',''),JSON.parse(json));
    Scenario.set(s);
  }
  loadImagesFromJson(json: string){
    const i = Object.assign(new Map<string,string | ArrayBuffer> (),JSON.parse(json));
    Scenario.setImages(i);
  }
  saveScenarioInJson(): string{
    return JSON.stringify(Scenario.get());
  }
  saveImagesInJson(): string{
    return JSON.stringify(Scenario.getImages());
  }

  async zipScenario(json: string){
    const zip = new JSZip();
    zip.file('ScenarioFile.json',json);

    for(const [key, value] of Scenario.getImages()){
      const blob = await this.b64toBlob(value);
      zip.file(key+'.'+blob.type.split('/')[1],blob);
    }

    const archive = await zip.generateAsync({type : 'blob'});

      const dlink: HTMLAnchorElement = document.createElement('a');
      dlink.download = Scenario.get().title + '_' + Scenario.get().creator + '.sc';
      dlink.href =  URL.createObjectURL(archive);
      dlink.click();
      dlink.remove();

  }

  unZipScenario(f: File){
    const zip = new JSZip();
    const archive = zip.loadAsync(f);
    archive.then(z=>{
      z.file('ScenarioFile.json').async('string').then(json=>{
          this.loadScenarionFromJson(json);
          this.router.navigateByUrl('/Edition/'+ Scenario.get().title);
        });
    });
  }

  async b64toBlob(b64Data): Promise<Blob>{
    return fetch(b64Data).then(res => res.blob());
  }

//#endregion


}
