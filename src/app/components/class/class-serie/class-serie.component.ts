// @ts-ignore
import validator from 'validator';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {environment} from "@environments/environment";
import axios from "axios";
import {Serie} from "@app/models/serie.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PreviewPdfDialogComponent} from "@app/components/shared/preview-pdf-dialog/preview-pdf-dialog.component";
import {PreviewNoteDialogComponent} from "@app/components/shared/preview-note-dialog/preview-note-dialog.component";
import {File} from "@app/models/file.model";
import {Comment} from "@app/models/comment.model";
import {Episode} from "@app/models/episode.model";

@Component({
  selector: 'app-class-serie',
  templateUrl: './class-serie.component.html',
  styleUrls: ['./class-serie.component.css']
})
export class ClassSerieComponent implements OnInit {
  domain: string = environment.domain;
  loading: boolean = true;
  showDetail: boolean = false;

  seriesId: string = '';
  episodeId: string = '';
  seriesRecord: Serie | undefined;
  selectedEpisode: Episode | undefined;

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private location: Location) { }

  ngOnInit(): void {
    this.seriesId = this.activatedRoute.snapshot!.params['series-id'];
    this.episodeId = this.activatedRoute.firstChild?.snapshot!.params['episode-id'];
    if(validator.isUUID(this.seriesId)){
      this.getSeries();
    } else {
      this.snackBar.open('Incorrect URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  openDialog(type: string, obj: (File | Comment)): void {
    if(type === 'pdf'){
      this.dialog.open(PreviewPdfDialogComponent, {
        data: obj,
        height: '90%',
        width: '90%'
      });
    } else if(type === 'note') {
      this.dialog.open(PreviewNoteDialogComponent, {
        data: obj,
        height: '90%',
        width: '90%'
      });
    } else {
      this.snackBar.open('Unknown file type','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  getIcon(ep: Episode){
    return ep.type == 'podcast' ? 'radio' : 'movie';
  }

  goToDetailPage(ep: Episode){
    this.showDetail = true;
    this.selectedEpisode = ep;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let path = this.location.path().split('ep')[0];
    let epString = '/ep/';
    if(path !== this.location.path()){
      epString = 'ep/'
    }
    this.location.replaceState( path + epString + ep.id);
  }

  getSeries(){
    let endpoint: string = environment.domain + environment.apiEndpoints.series.show.replace('{:id}', this.seriesId);
    axios.get(endpoint).then((res) => {
      this.seriesRecord = res.data as Serie;
      if(this.episodeId && validator.isUUID(this.episodeId)){
        let episode: Episode | undefined = this.getListOfEpisodes().find(ep => {
          return ep.id == this.episodeId;
        });
        if(episode){
          this.goToDetailPage(episode);
        } else {
          this.snackBar.open('The episode id is not contained by the series','X', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      }
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  private getListOfEpisodes(): Episode[]{
    let episodes: Episode[] = [];
    this.seriesRecord?.sections?.forEach(elem => {
      elem.episodes?.forEach(ep => {
        episodes.push(ep);
      })
    })
    return episodes;
  }
}
