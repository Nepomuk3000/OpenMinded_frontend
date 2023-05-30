import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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
  titi: String = '';

  constructor(private http: HttpClient) {}

  onSignup() {
    
    this.http.post('http://192.168.1.111:3000/api/user/signup', this.model).subscribe(response => {
      console.log(response);
    });
  }
  onLogin() {
    
    this.http.post('http://192.168.1.111:3000/api/user/login', this.model).subscribe(response => {
      console.log(response);
    });
  }

  getAngelique() {
    this.http.get('http://192.168.1.111:3000/api/user/642321cb49eeca71081ab7b4').subscribe(response => {
      console.log(response);
    });
  }
}