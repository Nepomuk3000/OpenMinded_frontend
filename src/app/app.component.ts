import { Component, HostListener, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ScrollService } from '../services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('centerLayout', { static: false }) centerLayout!: ElementRef;

  constructor(
    private scrollService: ScrollService){}

  ngAfterViewInit()
  {
    this.onResize();
    this.scrollService.div = this.centerLayout.nativeElement
  }

  @HostListener('window:resize', [])
  onResize() {

    // const element = this.elementRef.nativeElement.querySelector('.container');
    // this.renderer.setStyle(element, 'width', window.innerWidth < 500 ? '95%' : '500px');
  }



  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;    
    this.scrollService.sendScrollEvent(scrollTop);

  }
}
