import { Component, HostListener, Renderer2, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private renderer:Renderer2,
    private elementRef:ElementRef,
    public authService: AuthService){}

  ngOnInit()
  {
    this.onResize();
  }

  @HostListener('window:resize', [])
  onResize() {

    // const element = this.elementRef.nativeElement.querySelector('.container');
    // this.renderer.setStyle(element, 'width', window.innerWidth < 500 ? '95%' : '500px');

  }
}
