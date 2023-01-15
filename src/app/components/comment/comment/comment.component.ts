import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  submitComment: FormGroup;
  submitNote: FormGroup;
  htmlContent: string = '';
  commentTypeSelected: string = 'comment';
  isRegisteredUser: boolean = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '250px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'fontName'],
    ]
  };

  constructor(private formBuilder: FormBuilder) {
    this.submitComment = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.submitNote = this.formBuilder.group({
      note: ['', [Validators.required, Validators.maxLength(5000)]],
    });
  }

  ngOnInit(): void {

  }

  onSubmit(){

  }
}
