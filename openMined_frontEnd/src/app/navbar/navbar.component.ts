import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router,
              private translocoService: TranslocoService,
              public userService : UserService) {
                
    const lang = localStorage.getItem('lang') || 'en';
    this.changeLang(lang);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  } 
  
  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }

  logout()
  {
    this.userService.removeCurrentUser();
    this.navigateTo('signup');
  }

}
