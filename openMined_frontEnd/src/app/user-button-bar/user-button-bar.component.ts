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
  @Input() user:User = new User();
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
    this.likeUser.emit();
  }
  handleTalkButtonClick()
  {
    this.talkToUser.emit();
  }
  handleShareButtonClick()
  {
    this.shareUser.emit();
  }
  handleLoveButtonClick()
  {
    this.loveUser.emit();
  }
  handleRejectButtonClick()
  {
    this.userService.rejectUser(this.user);
    this.rejectUser.emit();
  }
}
