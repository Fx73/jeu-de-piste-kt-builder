import * as JSZip from 'jszip';

import { FirebaseStorage, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Firestore, doc, getFirestore, setDoc } from 'firebase/firestore';
import { getImagesInJson, getScenarioInJson, loadScenarionFromJson } from './app.serialization';

import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { Scenario } from './edition/game/scenario';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public static appUser: User;
  static db: Firestore;
  static storage: FirebaseStorage;
  private static staticRouter: Router;

  public menuItems = [
    { title: 'Scenario', method: this.currentScenario, icon: 'color-palette' },
    { title: 'Open', method: this.openFile, icon: 'folder-open' },
    { title: 'Save', method: this.saveFile, icon: 'save' },
    { title: 'Export', method: this.exportFile, icon: 'archive' },
    { title: 'Import', method: this.importFile, icon: 'download' },
    { title: 'Account', method: this.account, icon: 'heart' },
    { title: 'Help', method: this.help, icon: 'information-circle' },

  ];


  constructor(
    private router: Router,

    ) {
      AppComponent.db = getFirestore();
      AppComponent.storage = getStorage();

      AppComponent.staticRouter = router;
    }



    //#region menu items
  currentScenario(){
    if(Scenario.get()){
      this.router.navigateByUrl('/Edition/'+ Scenario.get().title);
    }else{
      this.router.navigateByUrl('/Home');
    }
  }

  openFile(){
    this.router.navigateByUrl('/Open');
    }

  async saveFile(){
    if (!AppComponent.appUser){
        this.showToast('You need to be logged to save');
        return;
    }

    const docData = {
      name: Scenario.get().title ?? '',
      creator: Scenario.get().creator ?? '',
      desciption: Scenario.get().description ?? '',
      icon: Scenario.getImage('ScenarioIcon') ?? ''
  };
  await setDoc(doc(AppComponent.db, AppComponent.appUser?.uid, Scenario.get().title+'_'+Scenario.get().creator), docData)
  .then(()=> {
    AppComponent.zipScenario(getScenarioInJson(Scenario.get()),Scenario.getImages()).then((blob)=>{
      const fileRef = ref(AppComponent.storage, AppComponent.appUser.uid + '/' + Scenario.get().fileName());
      uploadBytes(fileRef, blob).then((snapshot) => {
        this.showToast('Saved !');
      });
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode);
  });

    console.log(getScenarioInJson(Scenario.get()));
  }

  exportFile(){
    if(Scenario.get() == null){return;}

    const json = getScenarioInJson(Scenario.get());

    AppComponent.zipScenario(json, Scenario.getImages()).then((archive)=>{
      const dlink: HTMLAnchorElement = document.createElement('a');
      dlink.download = Scenario.get().fileName();
      dlink.href =  URL.createObjectURL(archive);
      dlink.click();
      dlink.remove();
    });
  }

  importFile(){
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      AppComponent.unZipScenario((e.target as HTMLInputElement).files[0]);
   };

    input.click();
    }

  account(){
    if(AppComponent.appUser){
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

  getUser(): string{
    return AppComponent.appUser?.displayName ?? AppComponent.appUser?.email;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static setUserStatic(appuser: User){
    this.appUser = appuser;
    this.staticRouter.navigate(['/Home']);
  }

  showToast(text: string){
    const toast = document.createElement('ion-toast');
    toast.header = text;
    toast.duration = 1000;
    document.body.appendChild(toast);
    toast.present();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static async zipScenario(json: string, images: Map<string,string | ArrayBuffer>): Promise<Blob>{
    const zip = new JSZip();
    zip.file('ScenarioFile.json',json);

    for(const [key, value] of images){
      const blob = await this.b64toBlob(value);
      zip.file(key+'.'+blob.type.split('/')[1],blob);
    }

    const archive = await zip.generateAsync({type : 'blob'});
    return archive;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static unZipScenario(blob: Blob){
    const zip = new JSZip();
    const archive = zip.loadAsync(blob);
    archive.then(z=>{
      z.file('ScenarioFile.json').async('string').then(json=>{
          Scenario.set(loadScenarionFromJson(json));
          const t = Scenario.get().title;
          this.staticRouter.navigateByUrl('/Edition/'+ Scenario.get().title);
        });
    });
  }

    // eslint-disable-next-line @typescript-eslint/member-ordering
  static b64toBlob(b64Data): Promise<Blob>{
    return fetch(b64Data).then(res => res.blob());
  }
//#endregion
}

