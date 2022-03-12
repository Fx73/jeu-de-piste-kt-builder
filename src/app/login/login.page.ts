import { Auth, FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, linkWithPopup, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	registerForm: FormGroup;
  loginForm: FormGroup;
  auth: Auth;

  constructor(private fb: FormBuilder) {
  this.registerForm = this.fb.group({
  email: ['', Validators.compose([Validators.required, Validators.email])],
  password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
  });
  this.loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
});
}
  ngOnInit() {
    this.auth = getAuth();
  }

  register(email: string, password: string): void {
    createUserWithEmailAndPassword(this.auth, email, password)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
	}

  login(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
}

  loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(this.auth, provider)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
}


  loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  signInWithPopup(this.auth, provider)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
}

}
