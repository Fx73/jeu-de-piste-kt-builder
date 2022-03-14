import { Component, OnInit } from '@angular/core';
import { collection, getDocs, } from 'firebase/firestore';
import { getBlob, ref } from 'firebase/storage';
import { loadImagesFromJson, loadScenarionFromJson } from '../app.serialization';

import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Scenario } from './../edition/game/scenario';

@Component({
  selector: 'app-open-file',
  templateUrl: './open-file.page.html',
  styleUrls: ['./open-file.page.scss'],
})
export class OpenFilePage implements OnInit {

  scenarioDescriptor = class {
    name: string;
    creator: string;
    description: string;
    icon: string | ArrayBuffer;
    constructor(name: string, creator: string, description: string, icon: string | ArrayBuffer){
      this.name = name;
      this.creator = creator;
      this.description = description;
      this.icon = icon;
    }
 };

  databaseDescriptors = Array();
  localDescriptor = null;

  constructor(private router: Router) { }

   ngOnInit() {
    this.loadScenarioLocal();
    this.loadScenarioList();
  }

  newScenario(){
    Scenario.set(new Scenario('','','',''));
    Scenario.setImages(new Map());
    this.router.navigateByUrl('/Edition/new');
  }

  loadScenarioLocal(){
    const json = localStorage.getItem('currentScenario');
    const icon = localStorage.getItem('currentImageIcon');
    if(json){
      const s: Scenario = JSON.parse(json);
      this.localDescriptor = new this.scenarioDescriptor(
        s.title,
        s.creator,
        s.description,
        icon
        );
    }
  }

  async loadScenarioList(){
    const collectionRef = collection(AppComponent.db, AppComponent.appUser?.uid);
    const querySnapshot = await getDocs(collectionRef);

    querySnapshot.forEach((docSnap) => {
      const sd = new this.scenarioDescriptor(
        docSnap.data().name,
        docSnap.data().creator,
        docSnap.data().description,
        docSnap.data().icon
        );
        this.databaseDescriptors.push(sd);
          });

  }

//#region Serialization

  loadLocalScenario(){
    const s = localStorage.getItem('currentScenario');
    const a = localStorage.getItem('currentImages');
    Scenario.set(loadScenarionFromJson(s));
    Scenario.setImages(loadImagesFromJson(a));
    this.router.navigateByUrl('/Edition/'+Scenario.get().title);
  }



  loadDatabaseScenario(sd: any){
    const filename = sd.name + '_' + sd.creator + '.sc';
    const fileRef = ref(AppComponent.storage, AppComponent.appUser.uid + '/' + filename);
    getBlob(fileRef).then((blob)=>{
      AppComponent.unZipScenario(blob);

    });
  }





//#endregion
}
