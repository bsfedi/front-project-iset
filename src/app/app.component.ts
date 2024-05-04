import { Component, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

const clientName = `${environment.default}`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mykrew';

  private logoutTimer: any;
  private readonly LOGOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  notification: string | undefined;
  constructor(private datePipe: DatePipe, private router: Router, private socket: Socket) {
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
}
