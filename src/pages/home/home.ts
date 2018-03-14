import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  uid: string;
  userDetails:any={}

  constructor(public navCtrl: NavController,
    public af: AngularFireAuth,
    public db: AngularFireDatabase, 
    public navParams: NavParams) {
  }

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    if (this.uid != null) {
      this.db.object('/users/' + this.uid).valueChanges().subscribe((res: any) => {
        this.userDetails = res;
        console.log(this.userDetails)
        // this.imageUrl = res.image != '' && res.image != null ? res.image : "assets/img/profile.jpg";
      })
    }  }

}
