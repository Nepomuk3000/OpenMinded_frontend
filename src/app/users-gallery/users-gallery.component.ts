import { Component, OnInit, AfterViewInit, HostListener   } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ScrollService } from '../../services/scroll.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users-gallery',
  templateUrl: './users-gallery.component.html',
  styleUrls: ['./users-gallery.component.scss']
})
export class UsersGalleryComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  lastLoadedUser:number = 0;
  noMoreUsers=false;
  scrollTop:number = 0

  constructor(private userService: UserService,
              private scrollService:ScrollService) {}

  ngOnInit(): void {
    this.scrollService.getScrollEvent().subscribe((scrollTop: number) => {
      // Code à exécuter lorsqu'un événement de défilement est reçu
      this.scrollTop = scrollTop
      this.loadComponentsIfNeeded();
    });

  }

  ngAfterViewInit() : void {
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
    const notEnoughSpace = this.scrollTop + 2 * windowHeight > this.scrollService.div.scrollHeight
    if (notEnoughSpace && !this.noMoreUsers && this.userService.isAuthenticated()) {
      // Charger les nouveaux composants
      await this.loadUsers(10,this.lastLoadedUser);

      // Appeler la fonction de chargement à nouveau après un certain délai
      setTimeout(() => {
        this.loadComponentsIfNeeded();
      }, 100); // ajustez le délai en fonction de vos besoins
    }
  }

  handleRejectUser()
  {
    console.log("TODO supprimer l'utilisateur rejeté de la gallerie");
  }
}
