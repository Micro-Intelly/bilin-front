import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-class-stream',
  templateUrl: './class-stream.component.html',
  styleUrls: ['./class-stream.component.css']
})
export class ClassStreamComponent implements OnInit {
  isVideo: boolean = true;
  streamId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.streamId = params['episode-id'];
      }
    );
  }

}
