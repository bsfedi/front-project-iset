import { Component } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-notificaion-rh',
  templateUrl: './notificaion-rh.component.html',
  styleUrls: ['./notificaion-rh.component.css']
})
export class NotificaionRhComponent {
  headers: any
  items: any
  notification: string[] = [];
  url: any
  shownb_consultants = false
  nb_demanades: any
  shownb_demanades = false
  nb_consultants: any
  lastnotifications: any
  nblastnotifications: any
  res: any
  token: any
  new_notif: any
  constructor(private inscriptionservice: InscriptionService, private studentservice: StudentService, private datePipe: DatePipe, private userservice: UserService, private socketService: WebSocketService, private route: Router, private router: ActivatedRoute, private consultantService: ConsultantService) { }
  gotoallnotification() {
    this.route.navigate([clientName + '/consultant/allnotifications'])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  markNotificationAsSeen(notification_id: any) {
    this.consultantService.markNotificationAsSeen(notification_id).subscribe({
      next: (res1) => {

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

  }
  gotovalidationmission(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + 'mission/' + _id])
  }
  gotovalidationtjm(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationpreregister(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + '/validation/' + _id])
  }
  ngOnInit(): void {
    this.studentservice.annonces().subscribe({
      next: (res) => {

        this.items = res
      }, error(e) {
        console.log(e);

      }
    });

  }
  gottoallStudents() {
    this.route.navigate([clientName + '/dashboard'])
  }
  gotovalidation(item: any) {

    if (item.status == "WAITINGCONTRACT") {
      this.route.navigate([clientName + '/validationmission/' + item._id + '/' + item.contractProcess])

    } else {
      this.route.navigate([clientName + '/validation/' + item._id])
    }

  }

  gotomyprofile() {
    this.route.navigate([clientName + '/edit-profil'])
  }
}
