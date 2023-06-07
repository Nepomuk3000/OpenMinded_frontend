
import { Component, OnInit, HostListener, ElementRef, Renderer2  } from '@angular/core';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  userId:string='';

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private userService: UserService) {}

  ngOnInit() {
    this.userId = this.userService.getUserId() as string;
    this.onResize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', window.innerWidth < 500 ? '95%' : '500px');
  }

}
