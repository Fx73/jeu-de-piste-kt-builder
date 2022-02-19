import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { StageElement, TYPE } from './game/element/stage_element';

import { ActivatedRoute } from '@angular/router';
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
    {name:'Button', icon:'link' , type : TYPE[TYPE.BTN]},
    {name:'Edit', icon: 'create' , type : TYPE[TYPE.EDT]},
    {name:'Step', icon: 'swap-horizontal' , type : TYPE[TYPE.ETP]},
    {name:'Toast', icon: 'sparkles' , type : TYPE[TYPE.TST]},
    {name:'QR', icon: 'qr-code' , type : TYPE[TYPE.QRC]},
    {name:'Lock', icon: 'lock-closed', type : TYPE[TYPE.LCK]},
    {name:'Unlock', icon: 'lock-open', type : TYPE[TYPE.UCK]},
  ];

  public edition: string;
  public scenario: Scenario;


   placeholdersize: number;
   placeholderindex = 0;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.edition = this.activatedRoute.snapshot.paramMap.get('id');
    this.placeholdersize = document.getElementsByClassName('cardtitle').item(0).getBoundingClientRect().width;

    this.loadScenarionFromJson(this.jsonScenario);
    console.log(this.scenario);
  }




  dropTool(event: CdkDragDrop<string[]>){

  }



  cdkDragMoved(event: any){
    console.log(event);
  }


//Region Model
stageMove(sender: number,target: any){
  moveItemInArray(this.scenario.stages,sender,target);
}

elementMove(event: CdkDragDrop<string[]>) {
  const stageFrom: number = +event.previousContainer.id;
  const stageTo: number = +event.container.id;
  const indexFrom: number = event.previousIndex;
  const indexTo: number = event.currentIndex;

  const previousElem: Array<StageElement> = this.scenario.stages[stageFrom].elements;
  const nextElem: Array<StageElement> = this.scenario.stages[stageTo].elements;

  const elem: StageElement= previousElem.splice(indexFrom,1)[0];
  nextElem.splice(indexTo,0,elem);
}
//#endregion

//region UI

addStage(){
  this.scenario.stages.push(new Stage(''));
}



getElementContent(element: StageElement){

}

getElementAdditional(element: StageElement){

}

getElementIcon(element: StageElement){
  const tool = this.getTools().find(t => t.type === element.type.toString());
  return tool?.icon ?? 'close-circle';
}

//#endregion


//#region Utilities

getTools(){
  return EditionPage.tools;
}
  loadScenarionFromJson(json: string){
    this.scenario = JSON.parse(json);
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
