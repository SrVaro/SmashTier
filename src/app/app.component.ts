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
      this.nativeStorage.getItem('google_user')
      .then( data =>{
        this.router.navigate(["/home"]);
        this.splashScreen.hide();
      }, error =>{
        this.router.navigate(["/login"]);
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
    });
  }

  /**
   * Metodo para cambiar de lenguaje en la aplicacion
   * 
   * @param e 
   */
  changeLang(e){
    if(e.detail.checked){
      this.translate.use("es");
    }else{
      this.translate.use("en");
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
