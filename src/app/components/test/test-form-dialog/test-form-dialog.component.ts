import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormService} from "@app/services/form.service";
import {Test} from "@app/models/test.model";
import {LanTag} from "@app/components/shared/language-tag-form-field/language-tag-form-field.component";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Serie} from "@app/models/serie.model";
import {SerieService} from "@app/services/serie.service";
import {Subscription} from "rxjs";
import {User} from "@app/models/user.model";
import {AccessLevel} from "@app/components/shared/access-level-selectors/access-level-selectors.component";

interface TestEditDialogData {
  obj: Test;
  mode: string;
  user: User;
}

@Component({
  selector: 'app-test-form-dialog',
  templateUrl: './test-form-dialog.component.html',
  styleUrls: ['./test-form-dialog.component.css']
})
export class TestFormDialogComponent implements OnInit {
  readonly DEFAULT_ACC_LEV = {
    selectedOrg: '',
    disableOrg: true,
    selectedAccess: 'public',
    disableAccess: false,
    selectedLevel: 'basic',
    disableLevel: false
  } as AccessLevel

  loading: Boolean = false;
  defaultTitle: string = '';
  defaultDescription: string = '';
  defaultLanTag: LanTag = {
    language: 'en-us',
    tags: new Set<string>(),
    languageId: '',
    tagsId: new Set<string>(),
    newTags: new Set<string>()
  } as LanTag;
  disableLanguage: boolean = false;
  submitTest: FormGroup | undefined;

  seriesList: Serie[] = [];
  selectedSerie: string = '';
  subscriptionSerie: Subscription | undefined;

  accessLevel = {...this.DEFAULT_ACC_LEV}

  /**
   * This is a constructor function that initializes various dependencies for a dialog component used for editing test
   * data.
   * @param {MatDialogRef} dialogRef
   * @param {TestEditDialogData} data
   * @param {MatSnackBar} snackBar
   * @param {FormService} formService
   * @param {FormBuilder} formBuilder
   * @param {SerieService} serieService
   */
  constructor(private dialogRef: MatDialogRef<TestFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TestEditDialogData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder,
              private serieService: SerieService) { }

  /**
   * The ngOnInit function initializes form values and retrieves series data for a component in an Angular application.
   */
  ngOnInit(): void {
    if(this.data.mode == 'edit'){
      this.defaultTitle = this.data.obj.title;
      this.defaultDescription = this.data.obj.description ? this.data.obj.description : "";
      this.defaultLanTag.language = this.data.obj.language?.code;
      this.defaultLanTag.tags = new Set<string>(this.data.obj.tags?.map(elem => elem.name));
      this.accessLevel.selectedAccess = this.data.obj.access;
      this.accessLevel.selectedLevel = this.data.obj.level;
      this.accessLevel.selectedOrg = this.data.obj.organization_id ?? '';
      this.selectedSerie = this.data.obj.series_id ?? '';
      this.onChangeSerie();
    }

    this.submitTest = this.formBuilder.group({
      title: [this.defaultTitle, [Validators.required,Validators.maxLength(100)]],
      description: [this.defaultDescription, [Validators.maxLength(500)]],
      lantag: [this.defaultLanTag, [Validators.required]],
      accesslevel: [this.accessLevel, [Validators.required]]
    });

    this.serieService.getUsersSeries(this.data.user.id);
    this.subscriptionSerie = this.serieService.series.subscribe((value) => {
      this.seriesList = [...value];
      if(this.seriesList.findIndex(elem => elem.id == '') < 0) {
        this.seriesList.unshift({id: '', title: 'None'} as Serie);
      }
      this.onChangeSerie();
    });
  }

  /**
   * The ngOnDestroy function unsubscribes from a subscription if it exists.
   */
  ngOnDestroy() {
    this.subscriptionSerie?.unsubscribe();
  }

  /**
   * The function checks if a form is valid and then either creates or updates a test based on the mode.
   */
  onSubmit(){
    if(this.submitTest?.valid){
      const body = this.submitTest.getRawValue();
      this.formatBody(body);

      if(this.data.mode == 'edit'){
        this.patchTest(body);
      } else {
        this.creatTest(body);
      }
    }
  }

  /**
   * This function updates the access level, organization, and language based on the selected series.
   */
  onChangeSerie(){
    if(this.selectedSerie){
      const serie = this.seriesList.filter(elem => elem.id == this.selectedSerie)[0];
      if(serie){
        this.accessLevel.disableLevel = true;
        this.accessLevel.selectedLevel = serie.level!;
        this.accessLevel.disableAccess = true;
        this.accessLevel.selectedAccess = serie.access!;
        this.accessLevel.disableOrg = true;
        this.accessLevel.selectedOrg = serie.organization? serie.organization.id : '';
        this.defaultLanTag.language = serie.language?.code;
        this.disableLanguage = true;
      }
    } else {
      this.accessLevel.disableLevel = false;
      this.accessLevel.disableAccess = false;
      this.accessLevel.disableOrg = false;
      this.disableLanguage = false;
    }
  }

  /**
   * This function formats the body of an object by assigning values to specific keys.
   * @param {any} body
   */
  private formatBody(body: any){
    body['language_id'] = body['lantag'].languageId;
    body['tags_id'] = body['lantag'].tagsId ? Array.from(body['lantag'].tagsId) : [];
    body['new_tags'] = body['lantag'].newTags ? Array.from(body['lantag'].newTags) : [];
    body['series_id'] = this.selectedSerie;
    body['access'] = body['accesslevel'].selectedAccess;
    body['level'] = body['accesslevel'].selectedLevel;
    body['organization_id'] = body['accesslevel'].selectedOrg;
  }

  /**
   * This function sends a PATCH request to update a test object using Axios in a TypeScript environment.
   * @param {any} body
   */
  private patchTest(body: any){
    const url = environment.domain + environment.apiEndpoints.tests.update.replace('{:id}', this.data.obj.id);
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
  /**
   * This function creates a test by sending a POST request to a specified API endpoint using Axios library in TypeScript.
   * @param {any} body
   */
  private creatTest(body: any){
    const url = environment.domain + environment.apiEndpoints.tests.create;
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
