import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Scenario } from './game/scenario';
import { Stage } from './game/stage';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.page.html',
  styleUrls: ['./edition.page.scss'],
})
export class EditionPage implements OnInit {

  public edition: string;
  public scenario: Scenario;
  public tools = [
    {name:'Texte', icon:'document-text'},
    {name:'Image', icon:'image'},
  ];


  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.edition = this.activatedRoute.snapshot.paramMap.get('id');
    this.scenarioTest();
    console.log(this.scenario);

    this.loadScenarionFromJson(this.jsonScenario);
    console.log(this.scenario);
  }


  drop(event: CdkDragDrop<string[]>) {
      console.log(event);

    }


  loadScenarionFromJson(json: string){
    this.scenario = JSON.parse(json);
  }













  scenarioTest(){
    this.scenario = new Scenario('test','fx','ceci est un test','');
    this.scenario.stages = [
      new Stage('stage 0'),
      new Stage('stage 1'),
      new Stage('stage 2'),
      new Stage('stage 3'),
      new Stage('stage 4'),
      new Stage('stage 5'),
      new Stage('stage 6'),
      new Stage('stage 7'),
      new Stage('stage 8'),
    ];
  }



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
