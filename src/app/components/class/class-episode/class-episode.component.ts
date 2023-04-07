import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Serie} from "@app/models/serie.model";
import {Episode} from "@app/models/episode.model";
import {environment} from "@environments/environment";
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-class-episode',
  templateUrl: './class-episode.component.html',
  styleUrls: ['./class-episode.component.css']
})
export class ClassEpisodeComponent implements OnInit {

  @Input() currentEpisode: Episode | undefined;
  @Input() series: Serie | undefined;
  streamUrl: string = '';

  constructor(private location: Location,
              private router: Router) { }

  ngOnInit(): void {
    this.refreshStreamUrl();
  }

  isActiveEpisode(epId: string){
    return epId === this.currentEpisode?.id ? 'active-ep' : '';
  }

  goToDetailPage(ep: Episode){
    this.currentEpisode = ep;
    this.location.replaceState(this.location.path().split('ep')[0] + 'ep/' + ep.id);
    this.refreshStreamUrl();
  }

  refreshStreamUrl(){
    this.streamUrl = environment.domain + environment.apiEndpoints.episodes.stream.replace('{:id}', this.currentEpisode!.id);
  }

  getEpisodes(){
    let res: Episode[] = [];
    this.series?.sections?.forEach((elem) => {
      elem.episodes?.forEach((ep) => {
        res.push(ep);
      })
    })
    return res;
  }
}
