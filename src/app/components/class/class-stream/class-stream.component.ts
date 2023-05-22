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

  /**
   * This is a constructor function that takes in two services, HistoryService and UserService, as parameters.
   * @param {HistoryService} historyService
   * @param {UserService} userService
   */
  constructor(private historyService: HistoryService,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  /**
   * This function sets up a subscription to the playing event of a video player and posts a history entry if it is the
   * first time the user is watching the episode and is logged in.
   * @param {VgApiService} api
   */
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

  /**
   * This function checks if the episode type is 'video'.
   * @returns {boolean} isVideo
   */
  isVideo() {
    return this.episode?.type == 'video';
  }
  /**
   * This function checks if the episode type is a podcast.
   * @returns {boolean} isPodcast
   */
  isPodcast() {
    return this.episode?.type == 'podcast';
  }
}
