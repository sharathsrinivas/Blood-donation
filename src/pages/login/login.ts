import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController,ToastController, LoadingController, Platform, AlertController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'sharath.sj7@gmail.com',
    password: '123456'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public af: AngularFireAuth,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }
  showAlert(message) {
    let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
    });
    alert.present();
}



  // Attempt to login in through our User service
  doLogin() {

      this.af.auth.signInWithEmailAndPassword(this.account.email, this.account.password).then((success) => {
          localStorage.setItem('uid', success.uid);
          window.localStorage.setItem("loggedIn", 'true');          
          // this.publishEvent();
          // this.navCtrl.setRoot("HomePage");
          this.navCtrl.setRoot(MainPage);
          
      })
          .catch((error) => {
              // this.showAlert(error.message);
              let toast = this.toastCtrl.create({
                message: error.message,
                duration: 3000,
                position: 'top'
              });
              toast.present();
          });

  }
}
