import {CdkDragDrop, moveItemInArray, Point, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StageElement, TYPE } from './game/element/stage_element';

import { ActivatedRoute } from '@angular/router';
import { Element } from './game/element/element';
import { Scenario } from './game/scenario';
import { Stage } from './game/stage';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.page.html',
  styleUrls: ['./edition.page.scss'],
})
export class EditionPage implements OnInit {
  public static tools = [
    {name:'Texte', icon:'document-text', type : TYPE[TYPE.TXT]},
    {name:'Image', icon:'image' , type : TYPE[TYPE.IMG]},
    {name:'Button', icon:'radio-button-on' , type : TYPE[TYPE.BTN]},
    {name:'Edit', icon: 'create' , type : TYPE[TYPE.EDT]},
    {name:'Step', icon: 'swap-horizontal' , type : TYPE[TYPE.ETP]},
    {name:'Toast', icon: 'sparkles' , type : TYPE[TYPE.TST]},
    {name:'QR', icon: 'qr-code' , type : TYPE[TYPE.QRC]},
    {name:'Lock', icon: 'lock-closed', type : TYPE[TYPE.LCK]},
    {name:'Unlock', icon: 'lock-open', type : TYPE[TYPE.UCK]},
    {name:'Variable', icon: 'reorder-four', type : TYPE[TYPE.VAR]},
  ];
  @ViewChild('recyclebin', { read: ElementRef }) binview: ElementRef;

  public edition: string;
  public scenario: Scenario;


   placeholdersize: number;
   placeholderindex = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
    ) {
  }

  ngOnInit() {
    this.edition = this.activatedRoute.snapshot.paramMap.get('id');
    this.placeholdersize = document.getElementsByClassName('cardtitle').item(0).getBoundingClientRect().width;

    this.loadScenarionFromJson(this.jsonScenario);
    console.log(this.scenario);


  }




  dropTool(event: CdkDragDrop<string[]>){
    console.log(event);
  }


//Region Model
stageMove(sender: number,target: any){
  moveItemInArray(this.scenario.stages,sender,target);
}
understageMove(sender: number,undersender: number,target: any){
  moveItemInArray(this.scenario.stages[sender].understages,undersender,target);
}
elementMove(event: CdkDragDrop<string[]>) {
  const stageFrom: number = +event.previousContainer.id;
  const stageTo: number = +event.container.id;
  const indexFrom: number = event.previousIndex;
  const indexTo: number = event.currentIndex;

  if(this.isInRecycleBin(event.dropPoint)){
    this.scenario.stages[stageFrom].elements.splice(indexFrom, 1);
    return;
  }

  const previousElem: Array<StageElement> = this.scenario.stages[stageFrom].elements;
  const nextElem: Array<StageElement> = this.scenario.stages[stageTo].elements;

  const elem: StageElement= previousElem.splice(indexFrom,1)[0];
  nextElem.splice(indexTo,0,elem);
}

underelementMove(event: CdkDragDrop<string[]>, stageid: number) {
  const stageFrom: number = +event.previousContainer.id;
  const stageTo: number = +event.container.id;
  const indexFrom: number = event.previousIndex;
  const indexTo: number = event.currentIndex;

  if(this.isInRecycleBin(event.dropPoint)){
    this.scenario.stages[stageid].understages[stageFrom].elements.splice(indexFrom, 1);
    return;
  }


  const previousElem: Array<StageElement> = this.scenario.stages[stageid].understages[stageFrom].elements;
  const nextElem: Array<StageElement> = this.scenario.stages[stageid].understages[stageTo].elements;

  const elem: StageElement= previousElem.splice(indexFrom,1)[0];
  nextElem.splice(indexTo,0,elem);
}

isInRecycleBin(elempos: Point): boolean{
  const rect = this.binview.nativeElement.getBoundingClientRect();
  return (elempos.x >= rect.left && elempos.x <= rect.right) && (elempos.y >= rect.top && elempos.y <= rect.bottom);
}

getElementContent(element: StageElement): SafeHtml {
  let html: string;
  switch(element.type.toString()){
    case 'TXT':
      html = '<ion-input value="'+element.content+'"></ion-input>';
      break;
    case 'IMG':
        html = '<ion-img src="'+this.getImage(element.content)+'"></ion-img>';
      break;
    case 'BTN':
      html = '<ion-button color="medium" expand="block">'+element.content+'</ion-button>';
          break;
    case 'EDT':
      html = '<ion-input placeholder="_____________________________________________________________" class="edt"></ion-input>'+
      '<ion-button color="medium" expand="block">'+element.content+'</ion-button>';
            break;
    case 'ETP':
      html = '<ion-input value="'+element.content+'"> -> Jump to step :</ion-input>';
      break;
    case 'TST':
      html ='<ion-card></ion-item><ion-input value="'+element.content+'"></ion-input></ion-card>';
              break;
    case 'QRC':
      html = '<ion-input value="'+element.content+'"></ion-input>';
                break;
    case 'LCK':
      html = '<ion-input value="'+element.content+'"></ion-input>';
                  break;
     case 'UCK':
      html = '<ion-input value="'+element.content+'"></ion-input>';
        break;
        case 'VAR':
          // eslint-disable-next-line max-len
          html = '<ion-select placeholder="Variable" <ion-select-option  *ngFor="let variable of scenario.variables.values; value="variable[0]">> {{variable[0]}} </ion-select-option></ion-select>';
          break;
  }

return this.sanitizer.bypassSecurityTrustHtml(html);
}

getElementAdditionalLabel(element: StageElement, index: number){
  const getlabelfun = element.type.toString().toLowerCase() + 'AdditionalLabels';
  const label: string = Element[getlabelfun]()[index];
  return label;
}

getElementIcon(element: StageElement){
  const tool = this.getTools().find(t => t.type === element.type.toString());
  return tool?.icon ?? 'close-circle';
}

addStage(){
  this.scenario.stages.push(new Stage(''));
}
addUnderStage(stageindex: number){
  if(!this.scenario.stages[stageindex].understages){
    this.scenario.stages[stageindex].understages = new Array();
  }
  this.scenario.stages[stageindex].understages?.push(new Stage(''));
}

addVariable(){
  this.scenario.variables.values.push(['',0]);
}

removeVariable(index: number){
  this.scenario.variables.values.splice(index, 1);
}
//#endregion


//#region Utilities

getTools(){
  return EditionPage.tools;
}
  loadScenarionFromJson(json: string){
    this.scenario = JSON.parse(json);
  }

  getImage(url: string){
    return 'assets/icon/favicon.png';
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
}
//#endregion
