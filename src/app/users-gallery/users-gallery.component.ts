import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';

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
    this.loadComponentsIfNeeded();
  }

  rejectUser(user: User) {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.loadComponentsIfNeeded();
    }
  }


  async loadUsers(count: number, skip: number) {
    let loadedUsersCount = 0; // Variable pour suivre le nombre réel d'utilisateurs lus
  
    try {
      const users: User[] = await firstValueFrom(this.userService.getUsers(count, this.lastLoadedUser));
      loadedUsersCount = users.length; // Nombre réel d'utilisateurs lus
      this.lastLoadedUser += users.length; // Mettre à jour la valeur de lastLoadedUser pour la prochaine requête
  
      if (users.length === 0) {
        this.noMoreUsers = true;
      }
      users.forEach(user => {
        this.users.push(user);
      });
    } catch (error) {
      this.noMoreUsers = true;
      // Gérer l'erreur, par exemple afficher un message d'erreur ou effectuer d'autres actions nécessaires
    }
  
    return loadedUsersCount; // Retourner le nombre réel d'utilisateurs lus
  }
  
  
  
  
  
  
  

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.loadComponentsIfNeeded();
  }

  async loadComponentsIfNeeded()
  {    
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    if (documentHeight <= window.scrollY + 2 * windowHeight && this.noMoreUsers == false && this.userService.isAuthenticated() == true) {
      // Charger les nouveaux composants
      await this.loadUsers(10,this.lastLoadedUser);

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
