import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  url: any = 'assets/imgs/profile.jpg';
  // profileDetails: { name: string, email: string, phone: string, adress: string, city: string, district: string, lastDonation: string, bloodType: string } = {
  //   name: '',
  //   email: 'sharath.sj7@gmail.com',
  //   phone: '123456',
  //   lastDonation: '',
  //   bloodType: '',
  //   adress: '',
  //   city: '',
  //   district: ''
  // };
  profileDetails:any={}
  public file: any = {};
  options = [
    {
        "type": "A+",
        "value": "A+"
    },
    {
        "type": "B+",
        "value": "B+"
    },
    {
        "type": "O-",
        "value": "O-"
    }
];

public storageRef = firebase.storage();

  constructor(public navCtrl: NavController,public toastCtrl: ToastController,public events: Events, public af: AngularFireAuth, public db: AngularFireDatabase, public loadingCtrl: LoadingController, public navParams: NavParams) {
  }

  ngOnInit() {
    if (this.af.auth.currentUser) {
      this.db.object('/users/' + this.af.auth.currentUser.uid).valueChanges().subscribe((res: any) => {
        this.profileDetails = res;
        this.profileDetails.image = res.image ? res.image : '';
        this.url = res.image ? res.image : "assets/imgs/profile.jpg";
      })
    }
  }
  readUrl(event) {
    this.file = (<HTMLInputElement>document.getElementById('file')).files[0];
    let metadata = {
      contentType: 'image/*'
    };
    let loader = this.loadingCtrl.create({
      content: 'please wait..'
    })
    loader.present();
    this.storageRef.ref().child('profile/' + this.file.name).put(this.file, metadata)
      .then(res => {
        this.profileDetails.image = res.downloadURL;
        this.url = res.downloadURL;
        this.db.object('users' + '/' + this.af.auth.currentUser.uid + '/image').set(res.downloadURL);
        loader.dismiss();
      }).catch(error => {
        loader.dismiss();
      });

  }
  postData(user) {
    
            if (this.af.auth.currentUser) {
                this.db.object('/users/' + this.af.auth.currentUser.uid).update({
                    name: this.profileDetails.name,
                    image: this.profileDetails.image,
                    email: this.profileDetails.email,
                    mobileNo: this.profileDetails.mobileNo,
                    // lastDonation:this.profileDetails.lastDonation,
                    // bloodType:this.profileDetails.bloodType,
                    // adress:this.profileDetails.adress,
                    // district:this.profileDetails.district,
                    // city:this.profileDetails.city,
                    
                }).then(() => {
                    this.createToaster("user information updated successfully", 3000);
                    this.events.publish('imageUrl',this.profileDetails);
                })
            }
        }
        createToaster(message, duration) {
          let toast = this.toastCtrl.create({
              message: message,
              duration: duration
          });
          toast.present();
      }

}
