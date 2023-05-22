import {Injectable, NgModule} from '@angular/core';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import { LoginComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { HomeComponent } from '@app/components/home/home.component';
import {ClassAllComponent} from "@app/components/class/class-all/class-all.component";
import {Title} from "@angular/platform-browser";
import {ClassSerieComponent} from "@app/components/class/class-serie/class-serie.component";
import {ForumAllComponent} from "@app/components/forum/forum-all/forum-all.component";
import {TestAllComponent} from "@app/components/test/test-all/test-all.component";
import {ForumDetailComponent} from "@app/components/forum/forum-detail/forum-detail.component";
import {TestDetailComponent} from "@app/components/test/test-detail/test-detail.component";
import {ProfileComponent} from "@app/components/auth/profile/profile.component";
import {HistoryComponent} from "@app/components/auth/history/history.component";
import {MyContentsComponent} from "@app/components/auth/my-contents/my-contents.component";
import {PageNotFoundComponent} from "@app/components/common/page-not-found/page-not-found.component";
import {ManageOrgUsersComponent} from "@app/components/auth/manage-org-users/manage-org-users.component";
import {ManageAllUsersComponent} from "@app/components/auth/manage-all-users/manage-all-users.component";

const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'class/series/:series-id', title: 'Series', component: ClassSerieComponent },
  { path: 'class/series/:series-id/ep', title: 'Episode', component: ClassSerieComponent,
    children: [
      { path: ':episode-id', title: 'Episode', component: ClassSerieComponent }
    ]
  },
  { path: 'class/:language', title: 'Class', component: ClassAllComponent },
  { path: 'forum/detail/:post-id', title: 'Forum detail', component: ForumDetailComponent },
  { path: 'forum/:language', title: 'Forum', component: ForumAllComponent },
  { path: 'test/detail/:test-id', title: 'Test detail', component: TestDetailComponent },
  { path: 'test/:language', title: 'Test', component: TestAllComponent },
  { path: 'profile', title: 'Profile', component: ProfileComponent },
  { path: 'manage-org-user', title: 'Manage Org User', component: ManageOrgUsersComponent },
  { path: 'manage-all-user', title: 'Manage User', component: ManageAllUsersComponent },
  { path: 'mycontents', title: 'My Contents', component: MyContentsComponent },
  { path: 'history', title: 'History', component: HistoryComponent },
  { path: 'class', redirectTo: "/class/all" },
  { path: 'forum', redirectTo: "/forum/all" },
  { path: 'test', redirectTo: "/test/all" },
  { path: '**', title: 'Not Found', component: PageNotFoundComponent },
];

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    let suffixes: string[] = [];

    // if(routerState.url.includes('/class')){
    //   const paramList = routerState.url.split('/');
    //   switch (paramList.length) {
    //     case 3: {suffixes.push(paramList[2].split(';')[0]);break;}
    //   }
    // }
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
