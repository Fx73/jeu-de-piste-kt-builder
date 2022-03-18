import { Component, OnInit } from '@angular/core';
import {
   copydbSharedScenario,
   dbgetOwnedList,
   dbgetOwnedScenario,
   dbgetShareCode,
   dbgetSharedList,
   deletedbScenario,
   getdbSharedDescriptor
} from '../app.database';
import { loadImagesFromJson, loadScenarioFromJson, unZipScenario } from '../app.serialization';

import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Scenario } from './../edition/game/scenario';
import { ScenarioDescriptor } from './scenario-descriptor';
import { actionSheetController } from '@ionic/core';

@Component({
  selector: 'app-open-file',
  templateUrl: './open-file.page.html',
  styleUrls: ['./open-file.page.scss'],
})
export class OpenFilePage implements OnInit {

  ownedDescriptors = Array();
  sharedDescriptors = Array();
  localDescriptor = null;



  constructor(private router: Router,public alertController: AlertController) { }

   ngOnInit() {
    this.loadDescriptorLocal();
    if(AppComponent.appUser){
      this.loadOwnScenarioList();
      this.loadSharedScenarioList();
    }
  }

  newScenario(){
    Scenario.set(new Scenario('','','',''));
    Scenario.setImages(new Map());
    this.router.navigateByUrl('/Edition/new');
  }

  newSharedScenario(){
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter code !',
      inputs: [
        {
          name: 'code',
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            getdbSharedDescriptor(data).then(sd=>{
              copydbSharedScenario(sd).then(()=>{
                this.router.navigateByUrl('Home');
                AppComponent.showToast('Import finished ! \n The file has been copied to your account');
              });
            });
          }
        }
      ]
    }).then((alert)=>{
      alert.present();
    });




  }

  loadDescriptorLocal(){
    const json = localStorage.getItem('currentScenario');
    const icon = localStorage.getItem('currentImageIcon');
    if(json){
      const s: Scenario = JSON.parse(json);
      this.localDescriptor = new ScenarioDescriptor(
        s.title,
        s.creator,
        s.description,
        icon
        );
    }
  }

  async loadOwnScenarioList(){
    const querySnapshot = await dbgetOwnedList();

    querySnapshot.forEach((docSnap) => {
      const sd = new ScenarioDescriptor(
        docSnap.data().name,
        docSnap.data().creator,
        docSnap.data().description,
        docSnap.data().icon
        );
        this.ownedDescriptors.push(sd);
          });

  }

  async loadSharedScenarioList(){
    const querySnapshot = await dbgetSharedList();

    querySnapshot.forEach((docSnap) => {
      const sd = new ScenarioDescriptor(
        docSnap.data().name,
        docSnap.data().creator,
        docSnap.data().description,
        docSnap.data().icon,
        docSnap.data().owner
        );
        this.sharedDescriptors.push(sd);
          });

  }

//#region Serialization

  loadLocalScenario(){
    const s = localStorage.getItem('currentScenario');
    const a = localStorage.getItem('currentImages');
    Scenario.set(loadScenarioFromJson(s));
    Scenario.setImages(loadImagesFromJson(a));
    this.router.navigateByUrl('/Edition/'+Scenario.get().title);
  }



  loadOwnScenario(sd: ScenarioDescriptor){
    dbgetOwnedScenario(sd.key() + '.sc').then((blob)=>{
      unZipScenario(blob);
    });
  }



  async contextOwn(event: any,sd: ScenarioDescriptor){
    event.preventDefault();
    actionSheetController.create({
      header: sd.name,
      buttons: [
        { text: 'Delete', role: 'destructive' , icon: 'trash', handler: () => this.deleteScenario(sd)},
        { text: 'Share', icon: 'share-social', handler: ()=> this.shareScenario(sd)},
        { text: 'Cancel', role: 'cancel' },
      ],
    }).then((as)=>{
      as.present();
    });
  }


  deleteScenario(sd: ScenarioDescriptor){
    deletedbScenario(sd).then(()=>{
      AppComponent.showToast('Deleted !');
      this.router.navigateByUrl('/Home');
    });
  }

  shareScenario(sd: ScenarioDescriptor){
    dbgetShareCode(sd).then((code)=>{
      AppComponent.showOKToast('Share code : ' + code);
    });  }


  loadSharedScenario(sd: any){

  }

  contextShared(event: any, sd: ScenarioDescriptor){
  }

//#endregion
}
