import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { AngularMaterialModule } from '@app/angular-material.module';
import { MatChipsModule } from "@angular/material/chips";
import { AuthGuard } from '@app/guards/auth.guard';
import { CookieService } from 'ngx-cookie-service';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { NgxPaginationModule } from 'ngx-pagination';

import { HeaderComponent } from '@app/components/header/header.component';
import { LoginComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { HomeComponent } from '@app/components/home/home.component';
import { FooterComponent } from '@app/components/footer/footer.component';
import { ClassAllComponent } from '@app/components/class/class-all/class-all.component';
import { ClassSerieComponent } from '@app/components/class/class-serie/class-serie.component';
import { ClassEpisodeComponent } from '@app/components/class/class-episode/class-episode.component';
import { ForumAllComponent } from '@app/components/forum/forum-all/forum-all.component';
import { TestAllComponent } from '@app/components/test/test-all/test-all.component';
import { TestDetailComponent } from '@app/components/test/test-detail/test-detail.component';
import { ForumDetailComponent } from '@app/components/forum/forum-detail/forum-detail.component';
import { ClassStreamComponent } from './components/class/class-stream/class-stream.component';
import { CommentComponent } from './components/comment/comment/comment.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FooterComponent,
    ClassAllComponent,
    ClassSerieComponent,
    ClassEpisodeComponent,
    ForumAllComponent,
    TestAllComponent,
    TestDetailComponent,
    ForumDetailComponent,
    ClassStreamComponent,
    CommentComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    MatChipsModule,
    NgxPaginationModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [CookieService,AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {

}

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http);
}
