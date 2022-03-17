import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Firestore, doc, getFirestore, setDoc } from 'firebase/firestore';
import { dbgetShareCode, dbsaveOwnedScenario } from './app.database';
import {
  getScenarioInJson,
  loadScenarioFromJson,
  unZipScenario,
  zipScenario,
} from './app.serialization';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Scenario } from './edition/game/scenario';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  static appUser: User;
  static db: Firestore;
  static storage: FirebaseStorage;

  public menuItems = [
    { title: 'Scenario', method: this.currentScenario, icon: 'color-palette' },
    { title: 'Open', method: this.openFile, icon: 'folder-open' },
    { title: 'Save', method: this.saveFile, icon: 'save' },
    { title: 'Export', method: this.exportFile, icon: 'archive' },
    { title: 'Import', method: this.importFile, icon: 'download' },
    { title: 'Share', method: this.share, icon: 'share-social' },
    { title: 'Account', method: this.account, icon: 'heart' },
    { title: 'Help', method: this.help, icon: 'information-circle' },
  ];

  constructor(private router: Router) {
    AppComponent.db = getFirestore();
    AppComponent.storage = getStorage();
  }

  //#region menu items
  currentScenario() {
    if (Scenario.get()) {
      this.router.navigateByUrl('/Edition/' + Scenario.get().title);
    } else {
      this.router.navigate(['/Home']);
    }
  }

  openFile() {
    this.router.navigate(['/Open']);
  }

  async saveFile() {
    if (!AppComponent.appUser) {
      AppComponent.showToast('You need to be logged to save');
      return;
    }

    dbsaveOwnedScenario(Scenario.get(),Scenario.getImages());

    console.log(getScenarioInJson(Scenario.get()));
  }

  exportFile() {
    if (Scenario.get() == null) {
      return;
    }

    const json = getScenarioInJson(Scenario.get());

    zipScenario(json, Scenario.getImages()).then((archive) => {
      const dlink: HTMLAnchorElement = document.createElement('a');
      dlink.download = Scenario.get().fileName();
      dlink.href = URL.createObjectURL(archive);
      dlink.click();
      dlink.remove();
    });
  }

  importFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      unZipScenario((e.target as HTMLInputElement).files[0]).then(
        ([json, images]) => {
          Scenario.set(loadScenarioFromJson(json));
          Scenario.setImages(images);
          this.router.navigateByUrl('/Edition/' + Scenario.get().title);
        }
      );
    };

    input.click();
  }

share(){
  if(!Scenario.get()){
    AppComponent.showToast('Cool ! But you need to have a scnario first !');
    return;
  }
  dbgetShareCode(Scenario.get()).then((code)=>{
    AppComponent.showOKToast('Share code : ' + code);
  });

}

  account() {
    if (AppComponent.appUser) {
      this.router.navigate(['/Account']);
    } else {
      this.router.navigate(['/Login']);
    }
  }

  help() {
    this.router.navigate(['/Help']);
  }
  //#endregion

  //#region utilities
  getUser(): string {
    return AppComponent.appUser?.displayName ?? AppComponent.appUser?.email;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static showToast(text: string) {
    const toast = document.createElement('ion-toast');
    toast.header = text;
    toast.duration = 1000;
    document.body.appendChild(toast);
    toast.present();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static showOKToast(text: string) {
    const toast = document.createElement('ion-toast');
    toast.header = text;
    toast.buttons = [{
        side: 'end',
        text: 'Close',
        role: 'cancel'
      }];
    document.body.appendChild(toast);
    toast.present();
  }
  //#endregion
}
