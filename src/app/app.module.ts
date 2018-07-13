import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { BrowsePaneComponent } from './browse-pane/browse-pane.component';
import { DisplayPaneComponent } from './display-pane/display-pane.component';
import { AccountWizardComponent } from './account-wizard/account-wizard.component';

import { ModalModule, CarouselModule } from 'ngx-bootstrap';

import { OAuthModule } from 'angular-oauth2-oidc';

import { MicrosoftGraphService } from './services/microsoft-graph.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    BrowsePaneComponent,
    DisplayPaneComponent,
    AccountWizardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    OAuthModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    AccountWizardComponent
  ],
  providers: [
    ElectronService,
    MicrosoftGraphService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
