import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Information, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.1.111:3000/api/user'; // Remplacez par votre URL d'API réelle
  constructor(private http: HttpClient) {}



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
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
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
      console.log(" --- " + key + " - " + value);
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
}

 