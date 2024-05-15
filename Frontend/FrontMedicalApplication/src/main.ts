import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment'; // Add this line
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: HttpClientModule },
//     { provide: AppRoutingModule }
//     // Add any other providers your app needs
//   ]
// }).catch(err => console.error(err));

platformBrowserDynamic().bootstrapModule(AppModule)
