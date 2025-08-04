import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { UiModule } from './ui/ui.module';

import { PwaInstallComponent } from './app-install';
// import { ContentModule } from './content/content.module';

@NgModule({
  declarations: [AppComponent, PwaInstallComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    // ContentModule,
    environment.production
      ? ServiceWorkerModule.register('/ngsw-worker.js')
      : [],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
