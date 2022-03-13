import { Auth, getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  auth: Auth;

  constructor() { }



  ngOnInit() {
    this.auth = getAuth();
  }

  emailVerified(): boolean{
    return this.auth.currentUser.emailVerified;
  }

  resendEmail(): void {
    sendEmailVerification(this.auth?.currentUser)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
	}

	logOut(): void {
    signOut(this.auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
	}

}
