import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private userIdKey = 'userId';
  private userNameKey = 'userName';
  private bIsAdmin = false;

  constructor(private userService: UserService){
    setTimeout(() => {
      this.calculateIsAdmin();
    }, 1); // ajustez le délai en fonction de vos besoins
  }

  @Output() newUserName: EventEmitter<String> = new EventEmitter();

  async saveUserInfos(token: string,userId: string,userName: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userIdKey, userId);
    localStorage.setItem(this.userNameKey, userName);
    this.calculateIsAdmin();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  removeTokenAndUserId(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
    this.bIsAdmin = false;
    this.newUserName.emit("");
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    return this.bIsAdmin;
  }

  private calculateIsAdmin() {
    const userId = this.getUserId();
    if (userId) {
      this.userService.getUser(userId)
        .pipe(
          map(user => user.isAdmin)
        )
        .subscribe(isAdmin => {
          this.bIsAdmin = isAdmin;
        });
    } else {
      this.bIsAdmin = false;
    }
  }
}
