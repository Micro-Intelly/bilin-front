import {Injectable, NgModule} from '@angular/core';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import { LoginComponent } from '@app/components/auth/login/login.component';
import { RegisterComponent } from '@app/components/auth/register/register.component';
import { HomeComponent } from '@app/components/home/home.component';
import {ClassAllComponent} from "@app/components/class/class-all/class-all.component";
import {Title} from "@angular/platform-browser";
import {ClassSerieComponent} from "@app/components/class/class-serie/class-serie.component";
import {ClassEpisodeComponent} from "@app/components/class/class-episode/class-episode.component";

const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'class/:language', title: 'Class', component: ClassAllComponent,
    children: [
      { path: ':series-id', component: ClassSerieComponent,
        children: [
          {path: ':episode-id', component: ClassEpisodeComponent}
        ]
      }
    ]
  },
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
