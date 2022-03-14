import * as JSZip from 'jszip';

import { Scenario } from './edition/game/scenario';

/* eslint-disable prefer-arrow/prefer-arrow-functions */



export function loadScenarionFromJson(json: string): Scenario{
  const scenario: Scenario = Object.assign(new Scenario('','','',''),JSON.parse(json, jsonReviver));
  return scenario;
}

export function loadImagesFromJson(json: string): Map<string,string | ArrayBuffer>{
  const images: Map<string,string | ArrayBuffer> = JSON.parse(json, jsonReviver);
  //const iObject: Map<string,string | ArrayBuffer> = Object.assign(new Map<string,string | ArrayBuffer> (),images);
  return images;
}

export function getScenarioInJson(scenario: Scenario): string{
  return JSON.stringify(scenario, jsonReplacer);
}

export function getImagesInJson(images: Map<string,string | ArrayBuffer>): string{
  return JSON.stringify(images, jsonReplacer);
}




export function jsonReplacer(key: any, value: any) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}


export function jsonReviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
