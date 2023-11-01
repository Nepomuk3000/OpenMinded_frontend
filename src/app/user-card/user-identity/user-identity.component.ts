import { Component, OnInit, Input } from '@angular/core';
import { Information, Relationship, User } from '../../../models/user.model';

@Component({
  selector: 'app-user-identity',
  templateUrl: './user-identity.component.html',
  styleUrls: ['./user-identity.component.scss']
})
export class UserIdentityComponent implements OnInit {

  @Input() user: User = new User();
  @Input() isEditable:boolean=false;
  
  confirmPassword: string = '';
  passwordsMatch: boolean = true;

  ngOnInit(): void {
  }

  checkPasswordEquality() {
    this.passwordsMatch = this.user.password === this.confirmPassword;
  }

}
