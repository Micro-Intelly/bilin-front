// @ts-ignore
import validator from 'validator';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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
import {Utils} from "@app/utils/utils";
import {SeriesFormDialogComponent} from "@app/components/class/series-form-dialog/series-form-dialog.component";
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {User} from "@app/models/user.model";
import {
  ThumbnailEditFormDialogComponent
} from "@app/components/shared/thumbnail-edit-form-dialog/thumbnail-edit-form-dialog.component";
import {
  CommonEditData,
  CommonEditFormDialogComponent
} from "@app/components/class/common-edit-form-dialog/common-edit-form-dialog.component";
import {Section} from "@app/models/section.model";
import {NoteFormDialogComponent} from "@app/components/class/note-form-dialog/note-form-dialog.component";

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

  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  currentUser: User = null as any;

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.seriesId = this.activatedRoute.snapshot!.params['series-id'];
    this.episodeId = this.activatedRoute.firstChild?.snapshot!.params['episode-id'];
    if(validator.isUUID(this.seriesId)){
      this.getSeries();
      this.subscriptionUser = this.userService.user.subscribe((value) => {
        this.isLoggedIn = Boolean(value);
        if(this.isLoggedIn){
          this.currentUser = value;
        }
      });
    } else {
      this.snackBar.open('Incorrect URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  /**
   * It unsubscribes from the subscriptionLanguage.
   */
  ngOnDestroy(){
    this.subscriptionUser?.unsubscribe();
  }

  get userHasPermission(): boolean {
    return <boolean>(this.currentUser && this.seriesRecord && (this.currentUser.id === this.seriesRecord.author?.id || this.currentUser.role?.includes(environment.constants.role.manager) || this.currentUser.role?.includes(environment.constants.role.admin)));
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
  }

  onEditSerie(serieRec: Serie){
    const dRes = this.dialog.open(SeriesFormDialogComponent, {
      data: {obj:serieRec, mode:'edit', user: this.currentUser},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getSeries();
      }
    });
  }
  onDeleteSerie(serieRec: Serie){
    const url = environment.domain + environment.apiEndpoints.series.delete.replace('{:id}', serieRec.id);
    const redirection = '/class/all';
    this.loading = true;
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.router.navigate([redirection]);
        }
        this.loading = false
      });
  }


  onAddFile(){
    const commEditData: CommonEditData = {
      serie: this.seriesRecord!,
      obj: 'file',
      name: '',
      description: '',
      url: environment.domain + environment.apiEndpoints.series.file.create.replace('{:idSerie}', this.seriesRecord!.id),
      mode: 'create',
    }
    this.openCommonEditDialog(commEditData);
  }
  onDeleteFile(event: Event,file: File){
    event.stopPropagation();
    const url = environment.domain + environment.apiEndpoints.series.file.delete.replace('{:idSerie}', this.seriesRecord!.id).replace('{:idFile}', file.id);
    this.deleteRecord(url);
  }

  onAddSection(){
    const commEditData: CommonEditData = {
      serie: this.seriesRecord!,
      obj: 'section',
      name: '',
      description: '',
      url: environment.domain + environment.apiEndpoints.series.sections.create.replace('{:idSerie}', this.seriesRecord!.id),
      mode: 'create',
    }
    this.openCommonEditDialog(commEditData);
  }
  onEditSection(section: Section){
    const commEditData: CommonEditData = {
      serie: this.seriesRecord!,
      obj: 'section',
      name: section.name,
      description: section.description ?? '',
      url: environment.domain + environment.apiEndpoints.series.sections.update.replace('{:idSerie}', this.seriesRecord!.id).replace('{:idSection}', section.id),
      mode: 'edit',
    }
    this.openCommonEditDialog(commEditData);
  }
  onDeleteSection(section: Section){
    const url = environment.domain + environment.apiEndpoints.series.sections.delete.replace('{:idSerie}', this.seriesRecord!.id).replace('{:idSection}', section.id);
    this.deleteRecord(url);
  }

  onAddEpisode(section: Section){
    const commEditData: CommonEditData = {
      serie: this.seriesRecord!,
      obj: 'episode',
      name: '',
      description: '',
      url: environment.domain + environment.apiEndpoints.series.sections.episodes.create.replace('{:idSerie}', this.seriesRecord!.id).replace(':idSection', section.id),
      mode: 'create',
    }
    this.openCommonEditDialog(commEditData);
  }
  onEditEpisode(section: Section,episode: Episode){
    const commEditData: CommonEditData = {
      serie: this.seriesRecord!,
      obj: 'section',
      name: episode.title,
      description: episode.description ?? '',
      url: environment.domain + environment.apiEndpoints.series.sections.episodes.update.replace('{:idSerie}', this.seriesRecord!.id).replace('{:idSection}', section.id).replace('{:idEpisode}', episode.id),
      mode: 'edit',
    }
    this.openCommonEditDialog(commEditData);
  }
  onDeleteEpisode(section: Section,episode: Episode){
    const url = environment.domain + environment.apiEndpoints.series.sections.episodes.delete.replace('{:idSerie}', this.seriesRecord!.id).replace('{:idSection}', section.id).replace('{:idEpisode}',episode.id);
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.getSeries();
        }
      });
  }

  onAddNote(){
    const dRes = this.dialog.open(NoteFormDialogComponent, {
      data: {obj: this.seriesRecord, mode: 'create', note: null},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.getSeries();
      }
    });
  }
  onEditNote(note: Comment){
    const dRes = this.dialog.open(NoteFormDialogComponent, {
      data: {obj: this.seriesRecord, mode: 'edit', note: note},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.getSeries();
      }
    });
  }
  onDeleteNote(note: Comment){
    const url = environment.domain + environment.apiEndpoints.comments.delete.replace('{:id}', note.id);
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.getSeries();
        }
      });
  }

  onEditImage(){
    if(this.userHasPermission){
      const url = environment.domain + environment.apiEndpoints.series.updateThumbnail.replace('{:id}', this.seriesRecord!.id);
      const dRes = this.dialog.open(ThumbnailEditFormDialogComponent, {
        data: url,
        disableClose: false,
        width: '60',
        height: '60'
      })
      dRes.afterClosed().subscribe(result => {
        if(result == 'OK'){
          this.getSeries();
        }
      });
    }
  }

  private openCommonEditDialog(data: CommonEditData){
    const dRes = this.dialog.open(CommonEditFormDialogComponent, {
      data: data,
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.getSeries();
      }
    });
  }

  private getSeries(){
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

  private deleteRecord(url: string){
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.getSeries();
        }
      });
  }
}
