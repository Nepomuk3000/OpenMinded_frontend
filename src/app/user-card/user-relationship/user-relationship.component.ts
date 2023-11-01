import { Component, OnInit, Input } from '@angular/core';
import { Relationship, User } from '../../../models/user.model';

@Component({
  selector: 'app-user-relationship',
  templateUrl: './user-relationship.component.html',
  styleUrls: ['./user-relationship.component.scss']
})
export class UserRelationshipComponent implements OnInit {

  @Input() user: User = new User();
  @Input() isEditable:boolean=false;

  ngOnInit(): void {
  }

  addRelationship(): void {
    this.user.relationships.push(new Relationship())
  }
  
  removeRelationship(index:number): void {
    this.user.relationships.splice(index,1)
  }
  
}
