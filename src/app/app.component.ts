import * as JSZip from 'jszip';

import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Firestore, doc, getFirestore, setDoc } from 'firebase/firestore';
import {
  getImagesInJson,
  getScenarioInJson,
  loadScenarionFromJson,
  unZipScenario,
  zipScenario,
} from './app.serialization';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Scenario } from './edition/game/scenario';
import { User } from 'firebase/auth';
import { map } from '@firebase/util';

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
      this.showToast('You need to be logged to save');
      return;
    }

    const docData = {
      name: Scenario.get().title ?? '',
      creator: Scenario.get().creator ?? '',
      desciption: Scenario.get().description ?? '',
      icon: Scenario.getImage('ScenarioIcon') ?? '',
    };
    await setDoc(
      doc(
        AppComponent.db,
        AppComponent.appUser?.uid,
        Scenario.get().title + '_' + Scenario.get().creator
      ),
      docData
    )
      .then(() => {
        zipScenario(
          getScenarioInJson(Scenario.get()),
          Scenario.getImages()
        ).then((blob) => {
          const fileRef = ref(
            AppComponent.storage,
            AppComponent.appUser.uid + '/' + Scenario.get().fileName()
          );
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
          Scenario.set(loadScenarionFromJson(json));
          Scenario.setImages(images);
          this.router.navigateByUrl('/Edition/' + Scenario.get().title);
        }
      );
    };

    input.click();
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

  showToast(text: string) {
    const toast = document.createElement('ion-toast');
    toast.header = text;
    toast.duration = 1000;
    document.body.appendChild(toast);
    toast.present();
  }

  //#endregion
}
