import { Component, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { WebSocketService } from './services/web-socket.service';

const clientName = `${environment.default}`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mykrew';
  private url: string = 'ws://34.121.4.38:5001/';
  public message: string = '';
  public messages: string[] = [];
  private subscription: any;
  private logoutTimer: any;
  private readonly LOGOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  notification: string | undefined;
  constructor(private datePipe: DatePipe, private router: Router, private socket: Socket, private webSocketService: WebSocketService) {

    this.startLogoutTimer();
    this.socket.on('notification', (data: any) => {
      this.notification = data.message;
    });
  }



  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  clearLocalStorage() {

  }
  startLogoutTimer() {


    this.logoutTimer = setTimeout(() => {
      // Perform logout action
      this.logout();
    }, this.LOGOUT_TIME);
  }

  resetLogoutTimer() {

    clearTimeout(this.logoutTimer);
    this.startLogoutTimer();
  }

  logout() {
    localStorage.clear();
    this.router.navigate([clientName + '/sign-in'])
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  onUserActivity(event: any) {
    this.resetLogoutTimer();
  }
  ngOnInit(): void {
    this.webSocketService.connect(this.url);
    this.subscription = this.webSocketService.getMessages().subscribe(
      (msg) => this.messages.push(msg),
      (err) => console.error(err),
      () => console.warn('Completed')
    );
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.webSocketService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }
}
