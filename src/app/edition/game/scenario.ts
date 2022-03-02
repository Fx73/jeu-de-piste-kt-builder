/**
 * Scenario
 * High Level Game Object
 * Contain all the data used to play
 * Handle the high level needs :
 * - Saving
 * - changing stage
 * - link the low level game class to fragment
 */

import { Config } from 'src/app.config';
import { Stage } from './stage';
import { Variables } from './variables';

export class Scenario{
  public icon: string | ArrayBuffer;
constructor(
  public title: string,
  public creator: string,
  public description: string,
  public copyright: string,
  public version: string = Config.version,
  public variables: Variables = new Variables(),
  public stages: Array<Stage> = new Array()
  ){}
  public setCurrentVersion(){
      this.version = Config.version;

  }
}
