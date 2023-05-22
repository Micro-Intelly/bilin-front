import {Component, Input, OnInit} from '@angular/core';
import {Serie} from "@app/models/serie.model";
import {Episode} from "@app/models/episode.model";
import {environment} from "@environments/environment";
import {Location} from "@angular/common";

@Component({
  selector: 'app-class-episode',
  templateUrl: './class-episode.component.html',
  styleUrls: ['./class-episode.component.css']
})
export class ClassEpisodeComponent implements OnInit {

  @Input() currentEpisode: Episode | undefined;
  @Input() series: Serie | undefined;
  streamUrl: string = '';

  /**
   * This is a constructor function
   * @param {Location} location
   */
  constructor(private location: Location) { }

  /**
   * The ngOnInit function calls the refreshStreamUrl function.
   */
  ngOnInit(): void {
    this.refreshStreamUrl();
  }

  /**
   * The function checks if a given episode ID is the same as the current episode ID and returns a string indicating if it
   * is active or not.
   * @param {string} epId
   * @returns {boolean} isActiveEpisode
   */
  isActiveEpisode(epId: string){
    return epId === this.currentEpisode?.id ? 'active-ep' : '';
  }

  /**
   * The function updates the current episode, replaces the current URL with the episode ID, and refreshes the stream URL.
   * @param {Episode} ep
   */
  goToDetailPage(ep: Episode){
    this.currentEpisode = ep;
    this.location.replaceState(this.location.path().split('ep')[0] + 'ep/' + ep.id);
    this.refreshStreamUrl();
  }

  /**
   * The function updates the stream URL by replacing a placeholder with the current episode ID and concatenating it with
   * the domain and API endpoint.
   */
  refreshStreamUrl(){
    this.streamUrl = environment.domain + environment.apiEndpoints.episodes.stream.replace('{:id}', this.currentEpisode!.id);
  }

  /**
   * This function returns an array of all episodes from a series.
   * @returns {Episode[]} res
   */
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
