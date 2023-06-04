import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';


interface LoginResponse {
  userId: string;
  userName: string;
  token: string;
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
  errorMessage: string ="";
  constructor(private http: HttpClient,private authService: AuthService) {}

  onSignup() {
    this.http.post('http://192.168.1.111:3000/api/user/signup', this.model).subscribe(response => {
      console.log(response);
    });
  }

  onLogin(form: NgForm) {
    this.model.username = form.value.username;
    this.model.password = form.value.password;
    console.log("this.username       : " + form.value.username);
    console.log("this.model.username : " + this.model.username);

     this.http.post<LoginResponse>('http://192.168.1.111:3000/api/user/login', this.model).subscribe(
       response => {
          // Succès de la requête (code de statut 200)
          console.log("DBG1 : " + response.userName)
          this.authService.removeTokenAndUserId();
          this.authService.saveUserInfos(response.token,response.userId,response.userName);
          this.errorMessage = "Your are logged"; // Masquer l'éventuelle erreur affichée précédement 
        },
        error => {
          // Erreur de la requête (autre code de statut que 200)
          this.errorMessage = error.message;
          this.authService.removeTokenAndUserId();
        }
    );
  }
}