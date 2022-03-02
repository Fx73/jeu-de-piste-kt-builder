import {CdkDragDrop, Point, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StageElement, TYPE } from './game/element/stage_element';

import { ActivatedRoute } from '@angular/router';
import { AppComponent } from './../app.component';
import { Config } from 'src/app.config';
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
  @ViewChild('recyclebin', { read: ElementRef }) recyclebin: ElementRef;
  @ViewChild('gamecontainer', { read: ElementRef }) gamecontainer: ElementRef;

  public edition: string;

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

    if(this.getScenario().version == null){
      this.getScenario().version =  Config.version;
    }

  }

  public getScenario(): Scenario{
    return AppComponent.scenario;
  }
  print(event: any){
    console.log(event);
  }

//Region Model
  dropTool(event: CdkDragDrop<string[]>){
    const x = event.dropPoint.x;
    const y = event.dropPoint.y;
    const elemtype: TYPE= TYPE[event.item.element.nativeElement.id];

    //Find the card
    const columns: HTMLCollection= this.gamecontainer.nativeElement.children;
    let index;
    let card;
    for (let i = 1; i < columns.length - 1; i++) {
      const c = columns.item(i).children.item(0);
      const rect = c.getBoundingClientRect();
      if(rect.left<=x && rect.right>=x){
        index = i-1;
        card = c;
      }
    }
    if(index == null || card == null ){return;}

    //Find the content
    let content: HTMLElement = card.querySelector('#gamecontent');
    if(content?.getBoundingClientRect().top<=y && content?.getBoundingClientRect().bottom>=y){
      this.getScenario().stages[index].elements.push(new StageElement( elemtype,''));
      return;
    }

    //Find the understage
    content = card.querySelector('#gameunderstage');
    if(content?.getBoundingClientRect().top<=y && content?.getBoundingClientRect().bottom>=y){
      const lines: NodeListOf<HTMLElement>= content.querySelectorAll('#gameundercard');
      let underindex;
      let undercard;
      for (let j = 0; j < lines.length; j++) {
        const rect = lines.item(j).getBoundingClientRect();
        if(rect.top<=y && rect.bottom>=y)
        {
          underindex = j;
          undercard = lines.item(j);
        }
      }
      if(underindex == null || undercard == null){return;}
      this.getScenario().stages[index].understages[underindex].elements.push(new StageElement( elemtype,''));



      return;
    }

  }


stageMove(sender: number,target: any){
  moveItemInArray(this.getScenario().stages,sender,target);
}
understageMove(sender: number,undersender: number,target: any){
  moveItemInArray(this.getScenario().stages[sender].understages,undersender,target);
}
elementMove(event: CdkDragDrop<string[]>) {
  const stageFrom: number = +event.previousContainer.id;
  const stageTo: number = +event.container.id;
  const indexFrom: number = event.previousIndex;
  const indexTo: number = event.currentIndex;

  if(this.isInRecycleBin(event.dropPoint)){
    this.getScenario().stages[stageFrom].elements.splice(indexFrom, 1);
    return;
  }

  const previousElem: Array<StageElement> = this.getScenario().stages[stageFrom].elements;
  const nextElem: Array<StageElement> = this.getScenario().stages[stageTo].elements;

  const elem: StageElement= previousElem.splice(indexFrom,1)[0];
  nextElem.splice(indexTo,0,elem);
}

underelementMove(event: CdkDragDrop<string[]>, stageid: number) {
  const stageFrom: number = +event.previousContainer.id;
  const stageTo: number = +event.container.id;
  const indexFrom: number = event.previousIndex;
  const indexTo: number = event.currentIndex;

  if(this.isInRecycleBin(event.dropPoint)){
    this.getScenario().stages[stageid].understages[stageFrom].elements.splice(indexFrom, 1);
    return;
  }


  const previousElem: Array<StageElement> = this.getScenario().stages[stageid].understages[stageFrom].elements;
  const nextElem: Array<StageElement> = this.getScenario().stages[stageid].understages[stageTo].elements;

  const elem: StageElement= previousElem.splice(indexFrom,1)[0];
  nextElem.splice(indexTo,0,elem);
}

isInRecycleBin(elempos: Point): boolean{
  const rect = this.recyclebin.nativeElement.getBoundingClientRect();
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
  this.getScenario().stages.push(new Stage(''));
}
addUnderStage(stageindex: number){
  if(!this.getScenario().stages[stageindex].understages){
    this.getScenario().stages[stageindex].understages = new Array();
  }
  this.getScenario().stages[stageindex].understages?.push(new Stage(''));
}

addVariable(){
  this.getScenario().variables.values.push(['',0]);
}

removeVariable(index: number){
  this.getScenario().variables.values.splice(index, 1);
}

applyChangeScenario(event: any){
  const value = event.detail.value;
  const variable: string = event.target.id;

  if(variable.startsWith('gamevarname')){
    this.getScenario().variables.values[+variable.charAt(variable.length-1)][0] = value;
    return;
  }
  if(variable.startsWith('gamevarvalue')){
    this.getScenario().variables.values[+variable.charAt(variable.length-1)][1] = value;
    return;
  }

  this.getScenario[variable] = value;
}

applyChangeStage(event: any, stageid: number){
  const value = event.detail.value;
  const variable: string = event.target.id;

  this.getScenario().stages[stageid][variable] = value;
}
//#endregion


//#region Utilities

getTools(){
  return EditionPage.tools;
}

  pickImage(stage: number, understage: number, pos: number){
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      const target: HTMLInputElement = e.target  as HTMLInputElement;
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = (event) => {
          AppComponent.scenario.icon = event.target.result;
        };
      }
   };

    input.click();
  }

  getImage(url: string){
    return 'assets/icon/favicon.png';
  }

//#endregion




}


