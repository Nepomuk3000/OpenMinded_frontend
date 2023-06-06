import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { serverUrl } from '../../config';


interface LoginResponse {
  userId: string;
  userName: string;
  token: string;
}

enum MessageType {
  Info = 'Info',
  Debug = 'Debug',
  Error = 'Error'
}

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {

  model = {
    firstname:'',
    lastname:'',
    username: '',
    email: '',
    password: ''
  };
  message: string ="";
  messageClass: string = "";

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,) {}

  onSignup() {
    this.http.post(serverUrl + '/api/user/signup', this.model).subscribe(response => {
      console.log(response);
    });
  }

  onLogin(form: NgForm) {
    this.model.username = form.value.username;
    this.model.password = form.value.password;

     this.http.post<LoginResponse>(serverUrl + '/api/user/login', this.model).subscribe(
       response => {
          // Succès de la requête (code de statut 200)
          this.authService.removeTokenAndUserId();
          this.authService.saveUserInfos(response.token,response.userId,response.userName);
          this.setMessage("You are logged in");
          this.router.navigate(['/']);
        },
        error => {
          // Erreur de la requête (autre code de statut que 200)
          this.setMessage(error.message, MessageType.Error);
          this.authService.removeTokenAndUserId();
        }
    );
  }

  setMessage(message:string, type:MessageType=MessageType.Info){
    this.message = message; // Masquer l'éventuelle erreur affichée précédement 
    switch (type) {
      case MessageType.Error:
        this.messageClass = 'error-message';
        break;
      case MessageType.Info:
        this.messageClass = 'info-message';
        break;
      default:
        console.log('Unknown message type');
    }
    setTimeout(() => {
      this.clearMessage();
    }, 4000);
  }

  clearMessage() {
    this.message="";
  }
}