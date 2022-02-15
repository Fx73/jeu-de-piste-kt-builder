/**
 * Scenario
 * High Level Game Object
 * Contain all the data used to play
 * Handle the high level needs :
 * - Saving
 * - changing stage
 * - link the low level game class to fragment
 */

import { Stage } from './stage';
import { Variables } from './variables';
import { config } from 'src/app.config';

export class Scenario{
constructor(
  public title: string,
  public creator: string,
  public description: string,
  public copyright: string,
  public version: string = config.version,
  public variables: Variables = new Variables(),
  public stages: Array<Stage> = new Array()
  ){}






}
