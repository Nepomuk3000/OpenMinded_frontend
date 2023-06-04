import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'src/services/auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router,private translocoService: TranslocoService,private authService : AuthService) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  } 
  

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  logout()
  {
    this.authService.removeTokenAndUserId();
  }

}
