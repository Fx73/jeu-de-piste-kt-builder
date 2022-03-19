/**
 * StageElement
 * Elements used to show an item on screen
 * Constructed element
 */

export enum TYPE{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IMG='IMG', TXT='TXT', QRC='QRC', VAR='VAR', BTN='BTN', EDT='EDT', ETP='ETP', LCK='LCK', UCK='UCK', TST='TST', MAP='MAP'
}

export class StageElement{
  condition = '';
constructor(
  public type: TYPE,
  public content: string,
  public additional: Array<string> = Array()
){
}


}
