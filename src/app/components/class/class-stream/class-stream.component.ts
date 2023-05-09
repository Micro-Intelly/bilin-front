import {Component, Input, OnInit} from '@angular/core';
import {Episode} from "@app/models/episode.model";
import {environment} from "@environments/environment";
import {VgApiService} from '@videogular/ngx-videogular/core';
import {HistoryService} from "@app/services/history.service";
import {UserService} from "@app/services/user.service";

@Component({
  selector: 'app-class-stream',
  templateUrl: './class-stream.component.html',
  styleUrls: ['./class-stream.component.css']
})
export class ClassStreamComponent implements OnInit {
  environment = environment;
  @Input() streamUrl: string = '';
  @Input() episode: Episode | undefined;
  @Input() episodeList: Episode[] | undefined;

  api: VgApiService | undefined;
  isFirstTime: boolean = true;

  constructor(private historyService: HistoryService,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.playing.subscribe(
      () => {
        if(this.isFirstTime && this.userService.isLoggedIn()){
          this.isFirstTime = false;
          this.historyService.postHistory('episode',this.episode!.id, this.episode?.serie_id);
        }
      }
    );
  }

  isVideo() {
    return this.episode?.type == 'video';
  }
  isPodcast() {
    return this.episode?.type == 'podcast';
  }
}
