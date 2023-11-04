
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
  })

  export class FooterComponent
  {
    constructor(public userService:UserService){}
  }