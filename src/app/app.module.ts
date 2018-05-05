import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPage } from '../pages/register/register';
import { RegisterPageModule } from '../pages/register/register.module';
import { ProfilePage } from '../pages/profile/profile';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { EditprofilePageModule } from '../pages/editprofile/editprofile.module';
import { MenuPage } from '../pages/menu/menu';
import { MymenuPage } from '../pages/mymenu/mymenu';
import { MymapPage } from '../pages/mymap/mymap';
import { ChangepicPage } from '../pages/changepic/changepic';
import { BookingPage } from '../pages/booking/booking';
import { BookinginitiatePage } from '../pages/bookinginitiate/bookinginitiate';
import { TabsPage } from '../pages/tabs/tabs';
import { BookingnowPage } from '../pages/bookingnow/bookingnow';
import { BookingoldPage } from '../pages/bookingold/bookingold';
import { SettingsPage } from '../pages/settings/settings';
import { TransactionsPage } from '../pages/transactions/transactions';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    MymenuPage,
    MymapPage,
    ChangepicPage,
    BookingPage,
    BookinginitiatePage,
    TabsPage,
    BookingnowPage,
    BookingoldPage,
    SettingsPage,
    TransactionsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    ProfilePageModule,
    RegisterPageModule,
    EditprofilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    EditprofilePage,
    MenuPage,
    MymenuPage,
    MymapPage,
    ChangepicPage,
    BookingPage,
    BookinginitiatePage,
    TabsPage,
    BookingnowPage,
    BookingoldPage,
    SettingsPage,
    TransactionsPage
  ],
  providers: [
    Diagnostic,
    StatusBar,
    SplashScreen,
    IonicStorageModule,
    File,
    Transfer,
    Camera,
    FilePath,
    GoogleMaps,
    Geolocation,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
