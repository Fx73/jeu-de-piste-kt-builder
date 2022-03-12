import * as JSZip from 'jszip';

import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { Scenario } from './edition/game/scenario';
import { firebaseConfig } from 'src/app.config';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public static user: User;


  public menuItems = [
    { title: 'New', method: this.newFile, icon: 'add' },
    { title: 'Open', method: this.openFile, icon: 'folder-open' },
    { title: 'Save', method: this.saveFile, icon: 'save' },
    { title: 'Export', method: this.exportFile, icon: 'archive' },
    { title: 'Import', method: this.importFile, icon: 'download' },
    { title: 'Account', method: this.account, icon: 'heart' },
    { title: 'Help', method: this.help, icon: 'information-circle' },

  ];

  constructor(
    private router: Router
    ) {

    }


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
    const s = this.getScenarioInJson();
    const a = this.getImagesInJson();
    localStorage.setItem('currentScenario', s);
    localStorage.setItem('currentImages', a);

    console.log(this.getScenarioInJson());
  }

  exportFile(){
    if(Scenario.get() == null){return;}

    const json = this.getScenarioInJson();
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

  account(){
    if(AppComponent.user){
      this.router.navigate(['/Account']);
    }else{
      this.router.navigate(['/Login']);
    }
  }

  help(){
    this.router.navigate(['/Help']);
  }
  //#endregion

//#region utilities
  loadScenarionFromJson(json: string){
    const s: Scenario = Object.assign(new Scenario('','','',''),JSON.parse(json));
    Scenario.set(s);
  }
  loadImagesFromJson(json: string){
    const i: Map<string,string | ArrayBuffer> = JSON.parse(json, this.jsonReviver);
    //const iObject: Map<string,string | ArrayBuffer> = Object.assign(new Map<string,string | ArrayBuffer> (),i);

    Scenario.setImages(i);
  }
  getScenarioInJson(): string{
    return JSON.stringify(Scenario.get());
  }
  getImagesInJson(): string{
    return JSON.stringify(Scenario.getImages(),this.jsonReplacer);
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

  jsonReplacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  jsonReviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

//#endregion


}
