import { Auth, getAuth, sendEmailVerification, signOut, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  auth: Auth;
  name: string;
  email: string;
  password: string;
  password2: string;

  constructor() {
  }


  ngOnInit() {
    this.auth = getAuth();
    this.name = this.auth.currentUser?.displayName ?? '';
    this.email = this.auth.currentUser?.email;
  }

  emailVerified(): boolean{
    return this.auth.currentUser?.emailVerified;
  }


  saveProfile(){
    updateEmail(this.auth.currentUser, this.email).then(() => {
        updateProfile(this.auth.currentUser,{displayName : this.name}).then(() => {
          alert('Profile updated');
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorCode);
        });

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
  }

  savePassword(){
    if(this.password !== this.password2)
      {return;}

    updatePassword(this.auth.currentUser,this.password).then(() => {
      alert('Password updated');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
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
