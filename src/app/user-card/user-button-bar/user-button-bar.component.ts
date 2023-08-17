import { Component, OnInit, Output, Input, EventEmitter   } from '@angular/core';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-button-bar',
  templateUrl: './user-button-bar.component.html',
  styleUrls: ['./user-button-bar.component.scss']
})
export class UserButtonBarComponent implements OnInit {
  @Input() userId:string = "";
  @Output() likeUser: EventEmitter<any> = new EventEmitter();
  @Output() talkToUser: EventEmitter<any> = new EventEmitter();
  @Output() shareUser: EventEmitter<any> = new EventEmitter();
  @Output() loveUser: EventEmitter<any> = new EventEmitter();
  @Output() rejectUser: EventEmitter<any> = new EventEmitter();

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  handleLikeButtonClick()
  {
    this.userService.like(this.userId);
  }

  handleLoveButtonClick()
  {
    this.userService.love(this.userId);
  }

  handleShareButtonClick()
  {
    console.log("TODO - UserButtonBarComponent : Implémenter handleShareButtonClick");
  }

  handleTalkToButtonClick()
  {
    console.log("TODO - UserButtonBarComponent : Implémenter handleTalkToButtonClick");
  }

  handleRejectButtonClick()
  {
    this.userService.reject(this.userId);
  }
}
