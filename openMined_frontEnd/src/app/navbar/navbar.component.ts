import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router,private translocoService: TranslocoService) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  } 
  

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

}
