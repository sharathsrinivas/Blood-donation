import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  templateUrl: 'app.html',
  selector: 'MyApp',
})
export class MyApp {
  uid: string;
  name: any;

  rootPage = this.figureOutWhatToLoad();
  imageUrl: any = 'assets/imgs/profile.jpg';

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    // { title: 'Tutorial', component: 'TutorialPage' },
    // { title: 'Welcome', component: 'WelcomePage' },
    // { title: 'Tabs', component: 'TabsPage' },
    // { title: 'Cards', component: 'CardsPage' },
    // { title: 'Content', component: 'ContentPage' },
    // { title: 'Login', component: 'LoginPage' },
    // { title: 'Signup', component: 'SignupPage' },
    // { title: 'Master Detail', component: 'ListMasterPage' },
    // { title: 'Menu', component: 'MenuPage' },
    // { title: 'Settings', component: 'SettingsPage' },
    // { title: 'Search', component: 'SearchPage' },
    { title: 'Home', component: 'HomePage' },    
    { title: 'Profile', component: 'ProfilePage' }


  ]

  constructor(private translate: TranslateService, public db: AngularFireDatabase, private events: Events, public af: AngularFireAuth, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    if (this.uid != null) {
      this.db.object('/users/' + this.uid).valueChanges().subscribe((res: any) => {
        this.name = res.name;
        this.imageUrl = res.image != '' && res.image != null ? res.image : "assets/img/profile.jpg";
      })
    }
    this.listenEvents();    

  }
  isLoggedin() {
    return localStorage.getItem('uid') != null;
  }

  private listenEvents() {
    this.events.subscribe('imageUrl', response => {
      this.imageUrl = response.image != '' && response.image != null ? response.image : 'assets/img/profile.jpg';
      this.name = response.name;
    })
  }


  figureOutWhatToLoad(): any {
    // if (this.user) {
    //   return 'TabsPage';
    // } else {
    //   return 'LoginPage';
    // }
    let loggedIn = window.localStorage.getItem("loggedIn");
    if (!loggedIn || loggedIn == 'false') {
      return 'LoginPage';
    } else {
      return 'HomePage';
    }
  }


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.af.auth.signOut();
    localStorage.removeItem('uid');
    // this.imageUrl='assets/img/profile.jpg';
    window.localStorage.setItem("loggedIn", 'false');
    this.nav.setRoot("LoginPage");
  }
}
