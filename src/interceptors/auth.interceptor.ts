import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map  } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService,private router: Router) {} 

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.error('Interceptor: Requête interceptée', request);
    if (this.userService.isAuthenticated()) {
      const token = this.userService.getCurrentUserToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      this.router.navigate(['/signup']);
    }
    //console.log('Interceptor: Requête après ajout du token', request);
    
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              //console.log('Interceptor: Réponse reçue avec le code', event.status);
          }
          return event;
      }),
      catchError((error: any) => {
          //console.error('Interceptor: Erreur détectée', error);

          // Vous pouvez utiliser `error.status` pour obtenir le code d'erreur
          if (error.status === 401) {
              this.userService.removeCurrentUser();
              this.router.navigate(['/signup']);
          }

          return throwError(error);
      })
  );
  }
}
