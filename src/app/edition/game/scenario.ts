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
  private static instance: Scenario;
  private static images: Map<string,string | ArrayBuffer> = new Map();

constructor(
  public title: string,
  public creator: string,
  public description: string,
  public copyright: string,
  public version: string = Config.version,
  public variables: Variables = new Variables(),
  public stages: Array<Stage> = new Array()
  ){}


  public static set(s: Scenario){
    this.instance = s;
  }
  public static get(): Scenario{
    return this.instance;
  }

  public static getImage(name: string): string | ArrayBuffer{
    return this.images.get(name);
  }
  public static setImage(name: string, image: string | ArrayBuffer){
    this.images.set(name,image);
  }

  public static moveImage(oldPlace: string, newPlace: string){
    this.images.set(newPlace,this.images.get(oldPlace));
    this.images.delete(oldPlace);
  }
  public static removeImage(name: string,){
    this.images.delete(name);
  }

  public static getImages():  Map<string,string | ArrayBuffer>{
    return this.images;
  }
  public static setImages(map: Map<string,string | ArrayBuffer>){
    this.images = map;
  }

  public static setCurrentVersion(){
      this.instance.version = Config.version;

  }


}
