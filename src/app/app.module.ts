import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { AngularFireModule } from'angularfire2'; 
import { AngularFirestoreModule } from'angularfire2/firestore'; 
import { environment } from'../environments/environment';
import { CustomLoadingModule } from './customModules/custom-loading/custom-loading.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
export function setTranslateLoader(http: any) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CustomLoadingModule,
     IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      HttpClientModule,
      TranslateModule.forRoot({  //Módulo de traducción
        loader: {
          provide: TranslateLoader, 
          useFactory: (setTranslateLoader), deps: [HttpClient]
        }
      })
    ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    TranslateService,
    TranslateStore,
    NativeStorage,
    { provide: 
      RouteReuseStrategy,
       useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
