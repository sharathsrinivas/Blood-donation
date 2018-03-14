import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { FormBuilder } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, mobileNo:string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    mobileNo: '',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public fb: FormBuilder,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {


    this.af.auth.createUserWithEmailAndPassword(this.account.email, this.account.password)
    .then((success) => {
        this.db.object('/users/' + success.uid).update({
            name: this.account.name,
            email: this.account.email,
            mobileNo: this.account.mobileNo,
            role: 'User'
        });

        localStorage.setItem('uid', success.uid);
        this.navCtrl.setRoot(MainPage);
    })
    .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        let toast = this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
    });

  }
}
