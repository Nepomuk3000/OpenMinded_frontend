import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Information, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { serverUrl } from '../config';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private apiUrl = serverUrl + '/api/user'; // Remplacez par votre URL d'API réelle
  private tokenKey = 'token';
  private userIdKey = 'userId';
  private userNameKey = 'userName';
  private bIsAdmin = false;
  @Output() newUserName: EventEmitter<String> = new EventEmitter();

  constructor(private http: HttpClient){
    setTimeout(() => { 
      this.calculateIsAdmin();
    }, 1); // ajustez le délai en fonction de vos besoins
  }



  completeUser(user: User) : Observable<User> {

    if (user.informations) {
      const profileInfo = user.informations.find((info: Information) => info.type === 'Profile');
      if (profileInfo)
      {
        user.profile = profileInfo.text;
      }
      else
      {
        user.profile = "--- No profile ---";
      }
    }
    else
    {
      user.profile = "--- No profile ---";
    }
    
    if (!user.image) {
      user.image = "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png";
    }
    try {
      const userId = user.relationships[0].userId;
      return this.getUser(userId, false).pipe(
        map((userObject: User) => {
          user.relationships[0].user = userObject;
          return user;
        })
      );
    } catch (error) {
      return of(new User());
    }
  }
  
  getUser(userId: string, complete: boolean = true): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/" + userId).pipe(
      map((user: User) => {
        if (complete) {
          this.completeUser(user).subscribe((user:User)=>{});
        }
        return user;
      })
    );
  }
  
  getUsers(count:number=10,skip:number=0): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + "?count=" + String(count)+ "&skip=" + String(skip)).pipe(
      map((users: User[]) => {
        users.forEach(user => {
          this.completeUser(user).subscribe((user:User)=>{});
        });
        return users;
      })
    );
  }
  
  getRandomUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/random/" + "642321cb49eeca71081ab7b4").pipe(
      map((user: User) => {
          this.completeUser(user).subscribe((user:User)=>{});
        return user;
      })
    );
  }


  saveUser() {
    
  }

  updateUser(user:User,newValues:any){
    Object.keys(newValues).forEach(key => {
      let value = newValues[key];
      if (key.startsWith("info_"))
      {
        const infoType = key.split('_')[1];
        const profileInfo = user.informations.find((info: Information) => info.type === infoType);
        if (profileInfo)
        {
          profileInfo.text = value;
        }
        else
        {
          const info = new Information();
          info.isPrivate= false;
          info.type = infoType;
          info.text = value;
          user.informations.push(info);
        }
      }

    });
    
    const profileInfo = user.informations.find((info: Information) => info.type === 'Profile');
    if (profileInfo)
    {
      profileInfo.text = newValues.info_Profile;
    }
    else
    {
      const info = new Information();
      info.isPrivate= false;
      info.type = "Profile"
      info.text = newValues.info_Profile;
      user.informations.push(info);
    }
    
    return this.http.put<User>(this.apiUrl + "/" + user._id,user).subscribe((user:User)=>
      { 
        return user;
      }
    );
  }

  rejectUser(user: User) {
      const currentUserId = String(this.getUserId());
      this.getUser(currentUserId).subscribe((currentUser: User) => {
        currentUser.rejectedUsers.push(user._id);
        this.updateUser(currentUser,currentUser);
        console.log(currentUser);
      });
    }
  

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
      this.getUser(userId)
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

 