import * as JSZip from 'jszip';

import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { Scenario } from './edition/game/scenario';
import { file } from 'jszip';

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
    { title: 'Help', method: '/Help', icon: 'information-circle' },

  ];

  constructor(
    private chooser: Chooser,
    private router: Router
    ) {}


  newFile(){
    Scenario.set(new Scenario('','','',''));
    this.loadScenarionFromJson(this.jsonScenario);
    this.router.navigateByUrl('/Edition/new');

  }

  openFile(){
    const s = localStorage.getItem('currentScenario');
    const a = localStorage.getItem('currentImages');
    this.loadScenarionFromJson(s);
    this.loadImagesFromJson(a);
    this.router.navigateByUrl('/Edition/new'+Scenario.get().title);
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

  //#region test
  // eslint-disable-next-line @typescript-eslint/member-ordering
  jsonScenario = `
  {
    "title": "Complex Scenario Test",
    "creator": "unitest",
    "description": "this is a test scenario",
    "copyright": "no",
    "variables": {
      "values": []
    },
    "stages": [
        {
            "name": "e0",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 0 of TXT and IMG",
                    "additional": [
                    ]
                },
                {
                    "type": "IMG",
                    "content": "e0i0",
                    "additional": [
                    ]
                }
            ],
            "next": [
                "e1"
            ]
        },
        {
            "name": "e1",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 1 of BTN",
                    "additional": [
                    ]
                },
                {
                    "type": "BTN",
                    "content": "BTN ?",
                    "additional": [
                        "u0"
                    ]
                }
            ],
            "next": [
                "e2",
                "e0"
            ],
            "understages": [
                {
                    "name": "u0",
                    "elements": [
                        {
                            "type": "TXT",
                            "content": "Test is ok",
                            "additional": [
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "e2",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 2 of EDT",
                    "additional": [
                    ]
                },
                {
                    "type": "EDT",
                    "content": "Write answer",
                    "additional": [
                        "u0",
                        "response",
                        "answer"
                    ]
                }
            ],
            "next": [
                "e3",
                "e1"
            ],
            "understages": [
                {
                    "name": "u0",
                    "elements": [
                        {
                            "type": "TXT",
                            "content": "Test is ok",
                            "additional": [
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "e3",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 3 of ETP part 1",
                    "additional": [
                    ]
                },
                {
                    "type": "ETP",
                    "content": "e4",
                    "additional": [
                    ]
                }
            ],
            "next": [
                "e4",
                "e3"
            ]
        },
        {
            "name": "e4",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 4 of ETP part 2 and TST",
                    "additional": [
                    ]
                },
                {
                    "type": "TST",
                    "content": "Test ok, should have jumped the 3",
                    "additional": [
                    ]
                }
            ],
            "next": [
                "e5",
                "e3"
            ]
        },
        {
            "name": "e5",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 5 of VAR and lock",
                    "additional": [
                    ]
                },
                {
                    "type": "LCK",
                    "content": "e6",
                    "additional": [
                    ]
                },
                {
                    "type": "BTN",
                    "content": "unlock",
                    "additional": [
                        "u0"
                    ]
                }
            ],
            "next": [
                "e6",
                "e4"
            ],
            "understages": [
                {
                    "name": "u0",
                    "elements": [
                        {
                            "type": "TXT",
                            "content": "Lock will be released",
                            "additional": [
                            ]
                        },
                        {
                            "type": "UCK",
                            "content": "e6",
                            "additional": [
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "e6",
            "elements": [
                {
                    "type": "TXT",
                    "content": "This is the test 6 of QRC",
                    "additional": [
                    ]
                },
                {
                    "type": "QRC",
                    "content": "QRC",
                    "additional": [
                    ]
                }
            ],
            "next": [
                "e100",
                "e5"
            ],
            "understages": [
                {
                    "name": "QRC",
                    "elements": [
                        {
                            "type": "TXT",
                            "content": "Test is ok",
                            "additional": [
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "e100",
            "elements": [
                {
                    "type": "TXT",
                    "content": "End of tests",
                    "additional": [
                    ]
                }
            ]
        }
    ]
  }
  `;
//#endregion

}
