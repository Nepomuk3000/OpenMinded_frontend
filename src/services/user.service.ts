import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { Information, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { serverUrl } from '../config';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';

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
    if (user.relationships && user.relationships.length > 0) {
      // Utilise forkJoin pour attendre que toutes les requêtes soient terminées
      return forkJoin(
        user.relationships.map((relationship) =>
          this.getUser(relationship.userId, false).pipe(
            catchError((error) => {
              // Gérez les erreurs pour chaque relation ici
              console.error(
                'Erreur lors de la récupération de l\'utilisateur :',
                error
              );
              return of(null); // Remplacez par une valeur par défaut ou d'autres actions en cas d'erreur
            })
          )
        )
      ).pipe(
        map((userObjects) => {
          // Mettez à jour les objets User dans les relations avec les objets récupérés
          userObjects.forEach((userObject, index) => {
            if (userObject) {
              user.relationships[index].user = userObject;
            }
          });
          return user; // Renvoie l'utilisateur mis à jour
        })
      );
    } else {
      // Si user.relationships est vide, renvoie simplement l'utilisateur actuel
      return of(user);
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

  async updateUser(user: User): Promise<HttpResponseBase> {


    try {
      const userObservable = await this.http.put<User>(this.apiUrl + "/", user).toPromise();

      console.log(userObservable)
      return new HttpResponse({
        status: 200,
        body: { data: 'Données de réponse' },
      });
    } catch (error: any) {
      // Gérez les erreurs de la requête HTTP ici
        console.error('Erreur pendant la requête :', error);
  
        // Renvoie un code d'erreur personnalisé, par exemple, un objet HttpErrorResponse
        return error as HttpErrorResponse;
      }
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

 