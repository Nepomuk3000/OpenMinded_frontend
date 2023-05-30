import { Component, OnInit, Output, EventEmitter   } from '@angular/core';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-button-bar',
  templateUrl: './user-button-bar.component.html',
  styleUrls: ['./user-button-bar.component.scss']
})
export class UserButtonBarComponent implements OnInit {
  @Output() likeUser: EventEmitter<any> = new EventEmitter();
  @Output() talkToUser: EventEmitter<any> = new EventEmitter();
  @Output() shareUser: EventEmitter<any> = new EventEmitter();
  @Output() loveUser: EventEmitter<any> = new EventEmitter();

  constructor() { }

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
}
