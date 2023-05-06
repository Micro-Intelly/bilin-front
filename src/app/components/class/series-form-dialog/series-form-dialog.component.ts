import {Component, Inject, OnInit} from '@angular/core';
import {AccessLevel} from "@app/components/shared/access-level-selectors/access-level-selectors.component";
import {LanTag} from "@app/components/shared/language-tag-form-field/language-tag-form-field.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Serie} from "@app/models/serie.model";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormService} from "@app/services/form.service";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {User} from "@app/models/user.model";

interface SerieEditDialogData {
  obj: Serie;
  mode: string;
  user: User;
}

@Component({
  selector: 'app-series-form-dialog',
  templateUrl: './series-form-dialog.component.html',
  styleUrls: ['./series-form-dialog.component.css']
})
export class SeriesFormDialogComponent implements OnInit {
  readonly DEFAULT_ACC_LEV = {
    selectedOrg: '',
    disableOrg: true,
    selectedAccess: 'public',
    disableAccess: false,
    selectedLevel: 'basic',
    disableLevel: false
  } as AccessLevel

  readonly SERIES_TYPE = ['video','podcast'];

  loading: Boolean = false;
  defaultTitle: string = '';
  defaultDescription: string = '';
  defaultType: string = '';
  defaultLanTag: LanTag = {
    language: 'en-us',
    tags: new Set<string>(),
    languageId: '',
    tagsId: new Set<string>(),
    newTags: new Set<string>()
  } as LanTag;
  disableLanguage: boolean = false;
  submitSerie: FormGroup | undefined;

  seriesList: Serie[] = [];
  selectedSerie: string = '';
  subscriptionSerie: Subscription | undefined;

  accessLevel = {...this.DEFAULT_ACC_LEV}

  constructor(private dialogRef: MatDialogRef<SeriesFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SerieEditDialogData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if(this.data.mode == 'edit'){
      this.defaultTitle = this.data.obj.title;
      this.defaultDescription = this.data.obj.description ? this.data.obj.description : "";
      this.defaultLanTag.language = this.data.obj.language?.code;
      this.defaultLanTag.tags = new Set<string>(this.data.obj.tags?.map(elem => elem.name));
      this.accessLevel.selectedAccess = this.data.obj.access ?? 'public';
      this.accessLevel.selectedLevel = this.data.obj.level ?? 'basic';
      this.accessLevel.selectedOrg = this.data.obj.organization_id ?? '';
      this.defaultType = this.data.obj.type;
    }

    this.submitSerie = this.formBuilder.group({
      title: [this.defaultTitle, [Validators.required,Validators.maxLength(100)]],
      type: [this.defaultType, [Validators.required]],
      description: [this.defaultDescription, [Validators.required,Validators.maxLength(500)]],
      lantag: [this.defaultLanTag, [Validators.required]],
      accesslevel: [this.accessLevel, [Validators.required]]
    });
  }

  ngOnDestroy() {
    this.subscriptionSerie?.unsubscribe();
  }

  onSubmit(){
    if(this.submitSerie?.valid){
      const body = this.submitSerie.getRawValue();
      this.formatBody(body);

      if(this.data.mode == 'edit'){
        this.patchSerie(body);
      } else {
        this.creatSerie(body);
      }
    }
  }

  private formatBody(body: any){
    body['language_id'] = body['lantag'].languageId;
    body['tags_id'] = body['lantag'].tagsId ? Array.from(body['lantag'].tagsId) : [];
    body['new_tags'] = body['lantag'].newTags ? Array.from(body['lantag'].newTags) : [];
    body['access'] = body['accesslevel'].selectedAccess;
    body['level'] = body['accesslevel'].selectedLevel;
    body['organization_id'] = body['accesslevel'].selectedOrg;
  }

  private patchSerie(body: any){
    const url = environment.domain + environment.apiEndpoints.series.update.replace('{:id}', this.data.obj.id);
    this.loading = true;
    axios.patch(url, body)
      .then(res => {
        Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
        this.loading = false;
      })
      .catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })
  }
  private creatSerie(body: any){
    const url = environment.domain + environment.apiEndpoints.series.create;
    this.loading = true;
    axios.post(url, body)
      .then(res => {
        Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
        this.loading = false;
      })
      .catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })
  }
}
