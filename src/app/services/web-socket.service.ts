import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  private subject: Subject<string>;

  constructor() {
    this.subject = new Subject<string>();
  }

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: any) => {
      this.subject.next(event.data);
    };

    this.socket.onerror = (error: any) => {
      this.subject.error(error);
    };

    this.socket.onclose = () => {
      this.subject.complete();
    };
  }

  public sendMessage(message: string): void {
    this.socket.send(message);
  }

  public getMessages(): Observable<string> {
    return this.subject.asObservable();
  }

  public disconnect(): void {
    this.socket.close();
  }
}
