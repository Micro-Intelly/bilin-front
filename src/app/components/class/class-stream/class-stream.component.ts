import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Episode} from "@app/models/episode.model";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-class-stream',
  templateUrl: './class-stream.component.html',
  styleUrls: ['./class-stream.component.css']
})
export class ClassStreamComponent implements OnInit {
  environment = environment;
  @Input() streamUrl: string = '';
  // ngOnChanges(streamUrl: string) {
  //   this.doSomething(model);
  // }
  @Input() episode: Episode | undefined;
  @Input() episodeList: Episode[] | undefined;
  streamUrlPrueba: string = 'http://localhost:8000/api/stream/98b46cde-5b9e-4498-a682-8a7036c548a3';

  constructor() { }

  ngOnInit(): void {
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.streamId = params['episode-id'];
    //   }
    // );
  }

  isVideo() {
    return this.episode?.type == 'video';
  }
  isPodcast() {
    return this.episode?.type == 'podcast';
  }

  changeSource(){
    if(this.streamUrlPrueba == 'http://localhost:8000/api/stream/98b46cde-5b9e-4498-a682-8a7036c548a3'){
      this.streamUrlPrueba = 'http://localhost:8000/api/stream/98b46cde-59b8-4f3b-b0ba-299a09e0e0fe';
    } else {
      this.streamUrlPrueba = 'http://localhost:8000/api/stream/98b46cde-5b9e-4498-a682-8a7036c548a3';
    }
  }
}
