import { EditionPage } from './../../edition.page';

/**
 * StageElement
 * Elements used to show an item on screen
 * Constructed element
 */

export enum TYPE{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IMG, TXT, QRC, VAR, BTN, EDT, ETP, LCK, UCK, TST
}

export class StageElement{
constructor(
  public type: TYPE,
  public content: string,
  public additional: Array<string> = Array()
){
}


}
