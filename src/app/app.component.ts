import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { FBServiceService } from './services/fbservice.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private router: Router,
    private googlePlus: GooglePlus,
    private translate: TranslateService
  ) {
    this.initializeApp();

    platform.ready().then(() => {
      //Here we will check if the user is already logged in
      //because we don't want to ask users to log in each time they open the app
      this.nativeStorage.getItem('google_user')
      .then( data =>{
        // user is previously logged and we have his data
        // we will let him access the app
        this.router.navigate(["/home"]);
        this.splashScreen.hide();
      }, error =>{
        this.router.navigate(["/login"]);
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
    });
  }

  changeLang(e){
    if(e.detail.checked){
      this.translate.use("en");
    }else{
      this.translate.use("es");
    }
  }

  doGoogleLogout(){
    this.googlePlus.logout()
    .then(res =>{
      //user logged out so we will remove him from the NativeStorage
      this.nativeStorage.remove('google_user');
      this.router.navigate(["/login"]);
    }, err =>{
      console.log(err);
    })
  }

  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
