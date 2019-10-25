import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AppUserComponent } from './app-user/app-user.component';
 import { RouterModule, Routes } from '@angular/router';

const config: SocketIoConfig = { url: 'http://10.60.100.56:8000', options: {} };
const appRoutes: Routes = [
  { path: 'user/:id', component: AppUserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AppUserComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
