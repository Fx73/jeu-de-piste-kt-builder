import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment.prod';
import { firebaseConfig } from './app.config';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));



  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const analytics = getAnalytics(firebaseApp);
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
      AppComponent.setUserStatic(user);
  });
