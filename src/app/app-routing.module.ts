import {Injectable, NgModule} from '@angular/core';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import { LoginComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { HomeComponent } from '@app/components/home/home.component';
import {ClassAllComponent} from "@app/components/class/class-all/class-all.component";
import {Title} from "@angular/platform-browser";
import {ClassSerieComponent} from "@app/components/class/class-serie/class-serie.component";
import {ClassEpisodeComponent} from "@app/components/class/class-episode/class-episode.component";
import {ForumAllComponent} from "@app/components/forum/forum-all/forum-all.component";
import {TestAllComponent} from "@app/components/test/test-all/test-all.component";
import {ForumDetailComponent} from "@app/components/forum/forum-detail/forum-detail.component";
import {TestDetailComponent} from "@app/components/test/test-detail/test-detail.component";
import {ClassStreamComponent} from "@app/components/class/class-stream/class-stream.component";

const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'class/series/:series-id', title: 'Series', component: ClassSerieComponent },
  { path: 'class/series/:series-id/ep', component: ClassEpisodeComponent,
    children: [
      { path: ':episode-id', component: ClassStreamComponent }
    ]
  },
  { path: 'class/:language', title: 'Class', component: ClassAllComponent },
  { path: 'forum/:language', title: 'Forum', component: ForumAllComponent,
    children: [
      { path: ':post-id', component: ForumDetailComponent }
    ]
  },
  { path: 'test/:language', title: 'Test', component: TestAllComponent,
    children: [
      { path: ':test-id', component: TestDetailComponent }
    ]
  },
  { path: 'class', redirectTo: "/class/all" },
  { path: 'forum', redirectTo: "/forum/all" },
  { path: 'test', redirectTo: "/test/all" },
  // { path: '**', component: PageNotFoundComponent },
];

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    let suffixes: string[] = [];

    if(routerState.url.includes('/class')){
      const paramList = routerState.url.split('/');
      switch (paramList.length) {
        case 3: {suffixes.push(paramList[2]);break;}
      }
    }
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      let newTitle = `Bilin | ${title}`;
      suffixes.forEach(elem => {
        newTitle += ' | ' + elem;
      })
      this.title.setTitle(newTitle);
    }
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
  ]
})
export class AppRoutingModule { }
