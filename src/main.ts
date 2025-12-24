// Main entry point for Ionic Angular App
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Define Ionic PWA Elements for Capacitor
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

// Initialize Ionic PWA Elements
defineCustomElements(window);

// Bootstrap the Angular application
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));