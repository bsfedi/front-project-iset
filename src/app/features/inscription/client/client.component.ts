import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  userSelection: string = 'true';
  myForm: FormGroup;
  items = ['Item 1', 'Item 2', 'Item 3'];
  register_id: any
  constructor(private inscriptionservice: StudentService, private fb: FormBuilder, private router: Router) {
    this.register_id = localStorage.getItem('register_id')
    this.myForm = this.fb.group({
      father_name: ['', Validators.required],
      mother_name: ['', Validators.required],
      father_phone: ['', Validators.required],
      mother_phone: ['', Validators.required],
      father_job: ['', Validators.required],
      mother_job: ['', Validators.required]
    });

  }

  // Add this method inside your PreInscriptionComponent class
  areAllFieldsFilled(): boolean {
    const formValues = this.myForm.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const value = formValues[key];
        if (value === null || value === undefined || value === '') {
          return false; // At least one field is empty
        }
      }
    }
    return true; // All fields are filled
  }

  onSubmit() {
    if (this.myForm.valid) {
      // Submit the form data to the server
      if (this.myForm.valid) {


        this.inscriptionservice.createfamilyinfo(this.myForm.value, this.register_id)
          .subscribe({
            next: (res) => {


              // Handle the response from the server

              this.router.navigate([clientName + '/informations/' + this.register_id]);
            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });
      } else {
        console.error('Form is invalid');
      }
      // Here you can call your service method to send the form data to the server
    } else {
      console.error('Form is invalid');
    }
  }
  // submit(): void {
  //   const token = localStorage.getItem('token');

  //   // Check if token is available
  //   if (token) {
  //     // Include the token in the headers
  //     const headers = new HttpHeaders().set('Authorization', `${token}`);




  //     if (this.areAllFieldsFilled() == false) {
  //       this.myForm.markAllAsTouched();
  //       return;
  //     }
  //     else {
  //       this.inscriptionservice.createinscrptionstep2(this.myForm.value, headers)
  //         .subscribe({
  //           next: (res) => {
  //             // Handle the response from the server
  //             console.log(res);
  //             this.router.navigate([clientName + '/mission']);

  //           },
  //           error: (e) => {
  //             // Handle errors
  //             console.error(e);
  //           }
  //         });
  //     }

  //   }
  // }

  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  // Function to set the file input for a specific field
  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
  }
  // Recursively mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
