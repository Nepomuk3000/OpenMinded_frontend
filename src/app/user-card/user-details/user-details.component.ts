import { Component, OnInit, Input } from '@angular/core';
import { Information, Relationship, User } from '../../../models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() user: User = new User();
  @Input() isEditable:boolean=false;

  ngOnInit(): void {
  }

  editableOrNot(): string {
    return this.isEditable ? 'editable' : 'notEditable';
  }

  addInfo(): void {
    this.user.informations.push(new Information())
  }
  
  removeInfo(index:number): void {
    this.user.informations.splice(index,1)
  }

}
