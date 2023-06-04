import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private userIdKey = 'userId';
  private userName = 'userName';

  @Output() newUserName: EventEmitter<String> = new EventEmitter();

  saveUserInfos(token: string,userId: string,userName: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userIdKey, userId);
    localStorage.setItem(this.userName, userName);
    console.log("save");
    this.newUserName.emit(userName);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userName);
  }

  removeTokenAndUserId(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userName);
    console.log("Revocation");
    this.newUserName.emit("");
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
