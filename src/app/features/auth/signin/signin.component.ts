import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-singin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  succesmessage = '';
  failedmessage = ''
  showerrormessage = false
  showsucessmessage = false
  res: any
  clientValidation: any
  contactClient: any
  contractValidation: any
  jobCotractEdition: any
  validation_rh: any
  constructor(private userservice: StudentService, private fb: FormBuilder, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

  }
  isAuthenticated() {
    return true;
  }
  hasRole(role: any) {
    if (role == localStorage.getItem('role')) {
      return true;
    }
    else {
      return false
    }

  }
  gotosingun() {
    this.router.navigate([clientName + '/sign-up']);
  }
  login(): void {
    if (this.signinForm.pristine) {
      this.signinForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };


    this.userservice.login(data)
      .subscribe({
        next: (res) => {
          console.log(res);

          this.showerrormessage = false;
          this.showsucessmessage = true;

          // Save the token in local storage
          localStorage.setItem('user_id', res.user_id);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', res.user);
          localStorage.setItem('register_id', res.register_id);
          localStorage.setItem('role', res.role);


          if (res.role == 'student') {
            const headers = new HttpHeaders().set('Authorization', `${res.token}`);

            this.userservice.getinscrption(res.register_id).subscribe({


              next: (res1) => {
                // Handle the response from the server
                this.res = res1.preregister

                console.log(this.res);

                if (this.res.status == 'NOTEXIST') {
                  this.router.navigate([clientName + '/pre-inscription']);
                }
                else if (this.res.status == 'NOTVALIDATED') {
                  this.router.navigate([clientName + '/informations/' + this.res._id]);

                }
                else if (this.res.status == 'VALIDATED') {
                  this.router.navigate([clientName + '/student/requests']);

                  // this.inscriptionservice.getContaractByPrerigister(this.res._id, headers).subscribe({
                  //   next: (res1) => {




                  //     this.validation_rh = this.res.status
                  //     this.clientValidation = res1.clientValidation
                  //     this.contactClient = res1.contactClient
                  //     this.contractValidation = res1.contractValidation
                  //     this.jobCotractEdition = res1.jobCotractEdition
                  //     if (this.validation_rh == 'VALIDATED' || this.clientValidation == 'VALIDATED' || this.contactClient == 'VALIDATED' || this.contactClient == 'VALIDATED' || this.jobCotractEdition == 'VALIDATED') {
                  //       this.router.navigate([clientName + '/student/requests']);
                  //     }
                  //     else {
                  //      
                  //     }


                  //   },
                  //   error: (e) => {
                  //     // Handle errors
                  //     console.error(e);
                  //     // Set loading to false in case of an error

                  //   }
                  // });



                }
                else {

                  this.router.navigate([clientName + '/pending']);


                }







              },
              error: (e) => {
                // Handle errors
                console.error(e);
                // Set loading to false in case of an error

              }
            });
            // 
          }
          else if (res.role == "tuitionofficer") {
            this.router.navigate([clientName + '/dashboard']);
          }
          else if (res.role == "enseignant") {
            this.router.navigate([clientName + '/enseignant']);

          }
          else if (res.role == "ADMIN" || res.role == "admin") {
            this.router.navigate([clientName + '/members']);

          }
          else if (res.role == "technicien") {
            this.router.navigate([clientName + '/demandes']);

          }
          else if (res.role == "directeurdepartement" || res.role == "directeuretudes") {
            this.router.navigate([clientName + '/gestionadministrative']);

          }

          else {
            this.router.navigate([clientName + '/dashboard']);
          }
          // Navigate to /informations on successful login

        },
        error: (e) => {
          this.failedmessage = e.error.message;
          this.showerrormessage = true;
          this.showsucessmessage = false;
        }
      });

    console.log(data);
  }
  gotoforgotpassword() {
    this.router.navigate([clientName + '/mot-de-passe-oublier']);
  }
}
