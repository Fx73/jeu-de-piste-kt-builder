import { Component, OnInit } from '@angular/core';

import { EditionPage } from './../edition/edition.page';
import { TYPE } from '../edition/game/element/stage_element';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})

export class HelpPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getTools(){
    return EditionPage.tools;
  }

  getToolHelp(type: TYPE){
    switch (type.toString()) {
      case 'TXT': return 'Display some text';
      case 'IMG' : return 'Display an image';
      case 'ETP': return 'Display a button labeled with a text. A click on the button will run a specific understage';
      case 'EDT' : return 'Display an input box, with a button labeled with a text.'+
      ' You can specify 2 answers that will be checked. If correct, an understage will run';
      case 'STP' : return 'Jump to an other stage. Usefull for an uderstage that will be leading to a stage';
      case 'TST' : return 'Show a small toast for a few seconds';
      case 'QRC': return 'Can run an understage with a QR code. Write the understage name.';
      case 'LCK': return 'Prevent the written stage to run. Should be used on the stages selected in the "next" area to be useful';
      case 'UCK': return 'Free the lock on the written stage, allowing the user to go to this stage';
      case 'VAR': return 'Affect a value to a variable. Permit simple operations';
      case 'MAP': return 'Show a button than open a maps window. Need the button message, latitude and longitude';
      default: return 'Type not referenced';
    }
  }
}
