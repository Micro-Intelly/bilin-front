import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import {Utils} from "@app/utils/utils";

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

  /**
   * The function updates the filtered user list based on a search query and resets the page count.
   */
  onSearchChange(){
    this.filteredUserList = this.getFilteredUserList();
    this.count = this.filteredUserList.length;
    this.page = 1;
  }

  /**
   * The function updates the current page based on the input event.
   * @param {any} event
   */
  onChangePage(event: any) {
    this.page = event;
  }

  /**
   * The function emits an event with the action "edit" and the user object as parameters.
   * @param {User} user
   */
  onEditUser(user: User){
    this.onActionClicked.emit({action : 'edit', user: user});
  }
  /**
   * The function onDeleteUser emits an event with the action 'delete' and the user object as parameters.
   * @param {User} user
   */
  onDeleteUser(user: User){
    this.onActionClicked.emit({action : 'delete', user: user});
  }

  /**
   * This function returns a filtered list of users based on a selected search criteria and search filter.
   * @returns {User[]} users
   */
  private getFilteredUserList(): User[]{
    return Utils.getSearcher(this.userList,this.selectedSearch).search(this.searchFilter);
  }
}
