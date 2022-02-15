/**
 * Scenario
 * Medium Level Game Object
 * Handle the medium level needs :
 * - Show current used element
 * - Wait for user game inputs and run the elements needed
 */

import { StageElement } from './element/stage_element';

export class Stage{
  constructor(
    public name: string,
    public elements: Array<StageElement> = Array(),
    public next: Array<string> = Array(),
    public understages: Array<Stage> = Array()
  ){}

}
