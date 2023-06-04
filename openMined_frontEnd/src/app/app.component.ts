import { Component, HostListener, Renderer2, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  userName:String="";
  constructor(
    private renderer:Renderer2,
    private elementRef:ElementRef,
    private authService: AuthService){}

  ngOnInit()
  {
    this.onResize();
    this.userName = String(this.authService.getUserName());
    this.authService.newUserName.subscribe((name: string) => {
      // Gérez l'événement ici, par exemple, affectez la valeur à une propriété du composant
      this.userName = name;
    });
  }

  @HostListener('window:resize', [])
  onResize() {

    // const element = this.elementRef.nativeElement.querySelector('.container');
    // this.renderer.setStyle(element, 'width', window.innerWidth < 500 ? '95%' : '500px');

  }
}
