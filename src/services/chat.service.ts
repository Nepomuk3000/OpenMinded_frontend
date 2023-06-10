import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverUrl } from 'src/config';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = serverUrl + '/api';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(serverUrl); // Remplacez serverUrl par l'URL de votre serveur Socket.IO
  }

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/`);
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages/`, message);
  }

  // Méthode pour écouter les nouveaux messages via la WebSocket
  onNewMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('newMessage', (message: any) => {
        observer.next(message);
      });
    });
  }
}
