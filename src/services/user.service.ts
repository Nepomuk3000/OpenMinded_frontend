import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Information, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { serverUrl } from '../config';
import { catchError } from 'rxjs/operators';


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

  setSearchRadius(searchRadius: number) {
    this.http.put<User>(this.apiUrl + "/search-radius", { searchRadius: searchRadius }).subscribe(
      (response) => {
        console.log("Rayon de recherche mis à jour  !");
        console.log(response);
      },
      (error) => {
        console.log("Erreur lors de la mise à jour du rayne de recherche !");
        console.log(error);
      }
    )
  }

  resetVisited() {
    this.http.put<User>(this.apiUrl + "/reset-visits","").subscribe(
      (response) => {
        console.log("Profil visités réinitialisés !");
        console.log(response);
      },
      (error) => {
        console.log("Erreur lors de la réinitialisation des profils visités !");
        console.log(error);
      }
    )
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
    if (this.isAuthenticated())
    {
      return this.http.get<User[]>(this.apiUrl + "?count=" + String(count)+ "&skip=" + String(skip)).pipe(
        map((users: User[]) => {
          users.forEach(user => {
            this.completeUser(user).subscribe((user:User)=>{});
          });
          return users;
        })
      );
    }
    return of([]); // Retourne null si l'utilisateur n'est pas authentifié

  }
  
  getRandomUser(): Observable<User | null> {
    return this.http.get<User>(this.apiUrl + "/random").pipe(
      catchError(error => {
        // Retourner un observable contenant null en tant qu'utilisateur par défaut
        return of(null);
      }),
      map((user: User | null) => {
        if (user !== null) {
          this.completeUser(user).subscribe((user: User) => {});
          return user;
        }
        return null; // Retourne null si user est null
      })
    );
  }

  updateUser(user:User){
      return this.http.put<User>(this.apiUrl + "/", user).subscribe((user:User)=>
      { 
        return user;
      }
    );
  }  

  async storeCurrentUserLocaly(token: string,userId: string,userName: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userIdKey, userId);
    localStorage.setItem(this.userNameKey, userName);
    this.calculateIsAdmin();
  }

  getCurrentUserToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getCurrentUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  addVisit(userId: string): void {
    this.http.put<User>(this.apiUrl + "/visited/" + userId,"").subscribe(
      (response) => {
        console.log("Visite ajoutée avec succès !");
        console.log(response);
      },
      (error) => {
        console.log("Erreur lors de l'ajout de la visite !");
        console.log(error);
      }
    )
  }

  removeCurrentUser(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
    this.bIsAdmin = false;
    this.newUserName.emit("");
  }

  isAuthenticated(): boolean {
    return this.getCurrentUserToken() !== null;
  }

  isCurrentUserAdmin(): boolean {
    return this.bIsAdmin;
  }

  like(userId:string) {
    this.getUser(userId).subscribe((user: User) => {
      console.log("UserService : " + this.getCurrentUserName() + " likes " + user.username);
    });



    const currentUserId = String(this.getCurrentUserId());
    this.getUser(currentUserId).subscribe((currentUser: User) => {
      this.http.put<User>(this.apiUrl + "/like/" + userId,userId).subscribe(
        (response) => {
          console.log("La requête PUT a été effectuée avec succès !");
          console.log(response);
        },
        (error) => {
          console.log("La requête PUT a échoué !");
          console.log(error);
        }
      )
    });

  }

  love(userId:string) {
    console.log("TODO - UserService : Implémenter love");
  }

  reject(userId:string) {
    console.log("TODO - UserService : Implémenter reject");
    
    const currentUserId = String(this.getCurrentUserId());
    this.getUser(currentUserId).subscribe((currentUser: User) => {
      this.http.put<User>(this.apiUrl + "/reject/" + currentUser._id,userId).subscribe(
        (response) => {
          console.log("La requête PUT a été effectuée avec succès !");
          console.log(response);
        },
        (error) => {
          console.log("La requête PUT a échoué !");
          console.log(error);
        }
      )
    });
  }

  private calculateIsAdmin() {
    const userId = this.getCurrentUserId();
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

 