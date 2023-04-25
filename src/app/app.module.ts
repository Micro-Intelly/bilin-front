import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
import { ProfileComponent } from './components/auth/profile/profile.component';
import { TestDialogComponent } from './components/test/test-dialog/test-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { FiltersTemplateComponent } from './components/shared/filters-template/filters-template.component';
import { PreviewPdfDialogComponent } from './components/shared/preview-pdf-dialog/preview-pdf-dialog.component';
import { PreviewNoteDialogComponent } from './components/shared/preview-note-dialog/preview-note-dialog.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { TestResultDialogComponent } from './components/test/test-result-dialog/test-result-dialog.component';
import { CloseRemindDialogComponent } from './components/shared/close-remind-dialog/close-remind-dialog.component';
import { HistoryComponent } from './components/auth/history/history.component';
import { MyContentsComponent } from './components/auth/my-contents/my-contents.component';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { SeriesGridComponent } from './components/shared/series-grid/series-grid.component';
import { TestsPostsListComponent } from './components/shared/tests-posts-list/tests-posts-list.component';
import { CommentsNotesListComponent } from './components/shared/comments-notes-list/comments-notes-list.component';
import { HistoriesListComponent } from './components/shared/histories-list/histories-list.component';
import { SeiresFormDialogComponent } from './components/class/seires-form-dialog/seires-form-dialog.component';
import { SectionFormDialogComponent } from './components/class/section-form-dialog/section-form-dialog.component';
import { EpisodeFormDialogComponent } from './components/class/episode-form-dialog/episode-form-dialog.component';
import { PostFormDialogComponent } from './components/forum/post-form-dialog/post-form-dialog.component';
import { TestFormDialogComponent } from './components/test/test-form-dialog/test-form-dialog.component';
import { QuestionFormDialogComponent } from './components/test/question-form-dialog/question-form-dialog.component';
import { PrivacyPolicyDialogComponent } from './components/shared/privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsOfServiceDialogComponent } from './components/shared/terms-of-service-dialog/terms-of-service-dialog.component';
import { SafeDataDirectiveDirective } from './shared/safe-data-directive.directive';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CommentEditDialogComponent } from './components/comment/comment-edit-dialog/comment-edit-dialog.component';
import { LanguageTagFormFieldComponent } from './components/shared/language-tag-form-field/language-tag-form-field.component';
import { ProfileEditFormDialogComponent } from './components/auth/profile-edit-form-dialog/profile-edit-form-dialog.component';
import { ThumbnailEditFormDialogComponent } from './components/auth/thumbnail-edit-form-dialog/thumbnail-edit-form-dialog.component';
import {FileUploadModule} from "ng2-file-upload";
import {QuestionUtils} from "@app/components/test/question-utils";
import { AccessLevelSelectorsComponent } from './components/shared/access-level-selectors/access-level-selectors.component';



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
    ProfileComponent,
    TestDialogComponent,
    FiltersTemplateComponent,
    PreviewPdfDialogComponent,
    PreviewNoteDialogComponent,
    TestResultDialogComponent,
    CloseRemindDialogComponent,
    HistoryComponent,
    MyContentsComponent,
    PageNotFoundComponent,
    SeriesGridComponent,
    TestsPostsListComponent,
    CommentsNotesListComponent,
    HistoriesListComponent,
    SeiresFormDialogComponent,
    SectionFormDialogComponent,
    EpisodeFormDialogComponent,
    PostFormDialogComponent,
    TestFormDialogComponent,
    QuestionFormDialogComponent,
    PrivacyPolicyDialogComponent,
    TermsOfServiceDialogComponent,
    SafeDataDirectiveDirective,
    SafeHtmlPipe,
    CommentEditDialogComponent,
    LanguageTagFormFieldComponent,
    ProfileEditFormDialogComponent,
    ThumbnailEditFormDialogComponent,
    AccessLevelSelectorsComponent,

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
    AngularEditorModule,
    MatDialogModule,
    PdfViewerModule,
    NgApexchartsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FileUploadModule,

  ],
  providers: [CookieService,AuthGuard,QuestionUtils],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {

}

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http);
}
