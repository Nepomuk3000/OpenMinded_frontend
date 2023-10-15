import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { serverUrl } from '../../config';

import { Validators,FormControl,FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

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
export class SignupFormComponent implements OnInit{

  model = {
    firstname:'',
    lastname:'',
    username: '',
    eMail: '',
    password: ''
  };
  message: string ="";
  messageClass: string = "";

  
  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  
  signupForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient,
              private userService: UserService,
              private router: Router,
              private messageService: MessageService) {}

  ngOnInit(){
    
  }

  onSignup() {
    const usernameControl = this.signupForm.get('login');
    const passwordControl = this.signupForm.get('password');
    const emailControl = this.signupForm.get('email');

    if (usernameControl && passwordControl && emailControl) {
      this.model.username = usernameControl.value;
      this.model.password = passwordControl.value;
      this.model.eMail = emailControl.value;
      this.http.post(serverUrl + '/api/user/signup', this.model).subscribe(
      response => {
        this.messageService.add(
                              { severity: 'success', 
                                summary: 'Signed-up', 
                                detail: "Your account is now created" });
        this.messageService.add(
                              { severity: 'info', 
                                summary: 'Signed-up', 
                                detail: "<pre>You will soon receive an eMail to validate your account.\nValidate your eMail before logging in</pre>",
                                sticky: true });
      },
      error => {
        // Erreur de la requête (autre code de statut que 200)
        error.error.errors.forEach((curError: any) => {
          this.messageService.add(
                                { severity: 'error', 
                                  summary: 'Error', 
                                  detail: "<pre>" + curError.step + "\n" + curError.message + "</pre>",
                                  sticky: true });
        });
        this.userService.removeCurrentUser();
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Signup form was not set properly" });
    }
  }

  onLogin() {

    const usernameControl = this.loginForm.get('login');
    const passwordControl = this.loginForm.get('password');

    if (usernameControl && passwordControl) {
      this.model.username = usernameControl.value;
      this.model.password = passwordControl.value;

      this.http.post<LoginResponse>(serverUrl + '/api/user/login', this.model).subscribe(
        response => {
          // Succès de la requête (code de statut 200)
          this.userService.removeCurrentUser();
          this.userService.storeCurrentUserLocaly(response.token,response.userId,response.userName);
          this.messageService.add({ severity: 'success', summary: 'Logged-in', detail: "You are logged in" });
          this.router.navigate(['/']);
        },
        error => {
          // Erreur de la requête (autre code de statut que 200)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Wrong login or password" });
          this.userService.removeCurrentUser();
        }
      );
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Login form was not set properly" });
    }
  }

}