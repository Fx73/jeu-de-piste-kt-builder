import { CollectionReference, DocumentData, DocumentReference, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { StorageReference, ref, uploadBytes } from 'firebase/storage';
import { getScenarioInJson, zipScenario } from './app.serialization';

import { AppComponent } from './app.component';
import { Scenario } from './edition/game/scenario';
import { ScenarioDescriptor } from './open-file/scenario-descriptor';

/* eslint-disable prefer-arrow/prefer-arrow-functions */

export const sharedLibrary = 'KeysShared';
export const ownKey = () => AppComponent.appUser.uid + '_own';
export const sharedKey = () => AppComponent.appUser.uid + '_shared';

export const userKey = (user: string) => user + '_own';


function dbDocRef(collId: string, docId: string): DocumentReference<DocumentData>{
  return doc(AppComponent.db, collId, docId);
}

function dbCollRef(collec: string): CollectionReference<DocumentData>{
  return collection(AppComponent.db, collec);
}


export function dbgetOwnedList(): CollectionReference<DocumentData>{
  const collectionRef = collection(AppComponent.db, ownKey());
  return collectionRef;
}

export function dbgetOwnedScenario(filename: string): StorageReference{
  const fileRef = ref(AppComponent.storage, ownKey() + '/' + filename);
  return fileRef;
}

export async function dbsaveOwnedScenario(scenario: Scenario, scenarioImages: Map<string,string |ArrayBuffer>){
  const sd = new ScenarioDescriptor(
    scenario.title,
    scenario.creator,
    scenario.description,
    scenarioImages.get('ScenarioIcon')
  );


  setDoc(dbDocRef(ownKey(),scenario.key()), sd.toObject())
    .then(() => {
      zipScenario(
        getScenarioInJson(scenario),
        scenarioImages
      ).then((blob) => {
        const fileRef = ref(
          AppComponent.storage,
          ownKey() + '/' + scenario.fileName()
        );
        uploadBytes(fileRef, blob).then((snapshot) => {
          AppComponent.showToast('Saved !');
        });
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });

}


export function dbgetSharedList(): CollectionReference<DocumentData>{
  const collectionRef = collection(AppComponent.db, sharedKey());
  return collectionRef;
}

export function dbgetSharedScenario(filename: string): StorageReference{
  const fileRef = ref(AppComponent.storage, sharedKey() + '/' + filename);
  return fileRef;
}

export async function dbgetShareCode(scenario: Scenario): Promise<string>{
  let code: string;
  const docSnap = await getDoc(dbDocRef(ownKey(),scenario.key()));

  if (docSnap.exists()) {
    code = docSnap.data().sharecode;
  } else {
    return 'CONNECTION ERROR';
  }

  if(!code){
    code = makeid(20);
    await updateDoc(dbDocRef(ownKey(),scenario.key()),{ sharecode: code });
  }

  console.log('code is ' + code);

  const sd = ScenarioDescriptor.sharedFactory(
    scenario.title,
    scenario.creator,
    AppComponent.appUser.uid
  );
  console.log(sd);

  await setDoc(dbDocRef(sharedLibrary, code),  sd.toObject(),{ merge: true });

  return code;
}


export function makeid(length): string {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *charactersLength));
 }
 return result;
}

export async function getdbSharedDescriptor(code: any): Promise<ScenarioDescriptor>{
  const docSnap = await getDoc(dbDocRef(sharedLibrary, code.code));

  if (docSnap.exists()) {
    return ScenarioDescriptor.sharedFactory(
      docSnap.data().name,
      docSnap.data().creator,
      docSnap.data().owner
    );
  } else {
    return null;
  }
}

export async function setdbSharedDescriptor(sd: ScenarioDescriptor){
  const docSnap = await getDoc(dbDocRef(userKey(sd.owner),sd.key()));

  if (docSnap.exists()) {
    const fullsd: ScenarioDescriptor = new ScenarioDescriptor(
      docSnap.data().name,
      docSnap.data().creator,
      docSnap.data().description,
      docSnap.data().icon,
      sd.owner
    );

    setDoc(dbDocRef(sharedKey(),fullsd.key()),fullsd.toObject(),{ merge: true })
    .then(()=>{
      AppComponent.showToast('Imported properly !');
    });
  }

}
