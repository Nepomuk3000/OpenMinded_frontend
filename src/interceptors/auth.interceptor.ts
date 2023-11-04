import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, catchError, throwError  } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService,private router: Router) {} 

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

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

    
    return next.handle(request).pipe(
      catchError((error: any) => {
        // Gérer les erreurs ici
        // Par exemple, vous pouvez logger l'erreur
        this.router.navigate(['/signup']);

        // Retournez un Observable qui émet une erreur (si nécessaire)
        return throwError(error);
      }))
  }
}
