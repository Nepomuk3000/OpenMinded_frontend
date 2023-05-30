import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-gallery',
  templateUrl: './users-gallery.component.html',
  styleUrls: ['./users-gallery.component.scss']
})
export class UsersGalleryComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // TODO : Charger les utilisateurs au fur et à mesure du scroll et pas tous d'un coup
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      users.forEach(user => {
        this.users.push(user);
        console.log("add user " + user.username);
      });
    });
  }
}
