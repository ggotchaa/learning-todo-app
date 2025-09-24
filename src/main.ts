import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    // importProvidersFrom(BrowserAnimationsModule)
    importProvidersFrom(RouterModule.forRoot([]))
  ]
}).catch(err => console.error(err));