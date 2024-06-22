import { Component } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Route, Router } from '@angular/router';

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
  constructor(private studentservice: StudentService, private datePipe: DatePipe, private route: Router, private router: ActivatedRoute) { }
  gotoallnotification() {
    this.route.navigate([clientName + '/consultant/allnotifications'])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  ens_id: any
  role: any
  fullname: any
  departement: any
  annonces_ens: any
  ngOnInit(): void {
    this.ens_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
          this.departement = res.preregister.personalInfo.departement
          this.studentservice.annonces(this.departement).subscribe({
            next: (res) => {

              this.items = res
            }, error(e) {
              console.log(e);

            }
          });
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          console.log(res.departement);

          this.fullname = res.first_name + " " + res.last_name
          this.departement = res.departement
          this.studentservice.annonces_ens(this.departement).subscribe({
            next: (res) => {
              console.log(this.departement);

              this.items = res
            }, error(e) {
              console.log(e);

            }
          });
        }, error(e) {
          console.log(e);

        }
      });
    }


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
