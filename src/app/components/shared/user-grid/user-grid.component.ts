import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import {Utils} from "@app/utils/utils";
import {Serie} from "@app/models/serie.model";
import {Post} from "@app/models/post.model";
import {Test} from "@app/models/test.model";

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.css']
})
export class UserGridComponent implements OnInit {
  @Input() mode: string = '';
  _userList : User[] = []
  @Input()
  set userList(value: User[]){
    this._userList = value;
    this.count = value.length;
    this.filteredUserList = value;
  }
  get userList(): User[] {
    return this._userList;
  }

  @Output()
  onActionClicked = new EventEmitter<{action: string, user: User}>();

  domain: string = environment.domain;

  searchBy = [
    {value: 'Name', label: 'Name'},
    {value: 'Email', label: 'Email'},
  ];
  selectedSearch: string = 'Name';
  searchFilter: string = '';
  filteredUserList: User[] = [];

  gridSize: number = 12;
  page: number = 1;
  count: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onSearchChange(){
    this.filteredUserList = this.getFilteredUserList();
    this.count = this.filteredUserList.length;
    this.page = 1;
  }

  onChangePage(event: any) {
    this.page = event;
  }

  onEditUser(user: User){
    this.onActionClicked.emit({action : 'edit', user: user});
  }
  onDeleteUser(user: User){
    this.onActionClicked.emit({action : 'delete', user: user});
  }

  private getFilteredUserList(): User[]{
    return Utils.getSearcher(this.userList,this.selectedSearch).search(this.searchFilter);
  }
}
