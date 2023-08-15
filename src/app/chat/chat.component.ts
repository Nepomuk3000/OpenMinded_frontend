// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: any[];
  newMessage: { content: string, sender: string };

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.newMessage = { content: '', sender: '' };
  }

  ngOnInit() {
    this.chatService.onNewMessage().subscribe(message => {
      
    console.log("onNewMessage",message)
      this.messages.push(message);
    });
  }

  sendMessage() {
    console.log("sendMessage",this.newMessage)
    this.chatService.sendMessage(this.newMessage).subscribe(message => {
      this.messages.push(message);
      this.newMessage.content = '';
      this.newMessage.sender = '';
    });
  }
}
