import * as JSZip from 'jszip';

import { Scenario } from './edition/game/scenario';
import { Variables } from './edition/game/variables';

/* eslint-disable prefer-arrow/prefer-arrow-functions */



export async function zipScenario(json: string, images: Map<string,string | ArrayBuffer>): Promise<Blob>{
  const zip = new JSZip();
  zip.file('ScenarioFile.json',json);

  for(const [key, value] of images){
    const blob = await this.b64toBlob(value);
    zip.file(key+'.'+blob.type.split('/')[1],blob);
  }

  const archive = await zip.generateAsync({type : 'blob'});
  return archive;
}
export function b64toBlob(b64Data): Promise<Blob>{
  return fetch(b64Data).then(res => res.blob());
}

export async function  unZipScenario(blob: Blob): Promise<[string, Map<string, string | ArrayBuffer>]>{
  const zip = new JSZip();
  const archive = await zip.loadAsync(blob);
  let json: string;
  const images: Map<string,string | ArrayBuffer> = new Map();

  await archive.forEach(async (relativePath, file) => {
    if(file.name === 'ScenarioFile.json'){
      json = await file.async('string');
    }else{
      images.set(file.name, await file.async('base64'));
    }
});

  return [json,images];
}


export function loadScenarioFromJson(json: string): Scenario{
  console.log(json);
  const scenario: Scenario = Object.assign(new Scenario('','','',''),JSON.parse(json, jsonReviver));
  return scenario;
}

export function loadImagesFromJson(json: string): Map<string,string | ArrayBuffer>{
  const images: Map<string,string | ArrayBuffer> = JSON.parse(json, jsonReviverArray);
  //const iObject: Map<string,string | ArrayBuffer> = Object.assign(new Map<string,string | ArrayBuffer> (),images);
  return images;
}

export function getScenarioInJson(scenario: Scenario): string{
  return JSON.stringify(scenario, jsonReplacer);
}

export function getImagesInJson(images: Map<string,string | ArrayBuffer>): string{
  return JSON.stringify(images, jsonReplacerArray);
}



export function jsonReplacer(key: any, value: any) {
  if(value instanceof Map) {
    const obj = {};
    for (const [k,v] of value.entries())
      {obj[k]=v;}
    return obj;
  } else {
    return value;
  }
}


export function jsonReviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (key === 'variablesvalues') {
      const arr = Object.entries(value);
      const map: Map<string,number> = new Map();
      arr.forEach(element => {
        map.set(element[0], Number(element[1]));
      });
      return map;
    }
  }
  return value;
}



export function jsonReplacerArray(key: any, value: any) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}


export function jsonReviverArray(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
