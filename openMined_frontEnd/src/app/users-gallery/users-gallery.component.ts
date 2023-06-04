import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-gallery',
  templateUrl: './users-gallery.component.html',
  styleUrls: ['./users-gallery.component.scss']
})
export class UsersGalleryComponent implements OnInit {

  users: User[] = [];
  lastLoadedUser:number = 0;
  noMoreUsers=false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // TODO : Charger les utilisateurs au fur et à mesure du scroll et pas tous d'un coup
    
    this.loadComponentsIfNeeded();
  }

  loadUsers(count:number,skip:number) {
    this.userService.getUsers(count,this.lastLoadedUser).subscribe((users: User[]) => {
      if (users.length == 0)
      {
        this.noMoreUsers=true;
      }
      users.forEach(user => {
        this.users.push(user);
      });
    });
    this.lastLoadedUser += count;
  }
  

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.loadComponentsIfNeeded();
  }

  loadComponentsIfNeeded()
  {    
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    if (documentHeight <= window.scrollY + 2 * windowHeight && this.noMoreUsers == false) {
      // Charger les nouveaux composants
      this.loadUsers(10,this.lastLoadedUser);

      // Appeler la fonction de chargement à nouveau après un certain délai
      setTimeout(() => {
        this.loadComponentsIfNeeded();
      }, 20); // ajustez le délai en fonction de vos besoins
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.loadComponentsIfNeeded();
  }

  handleRejectUser()
  {
    console.log("TODO supprimer l'utilisateur rejeté de la gallerie");
  }
}