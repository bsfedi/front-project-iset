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
  selector: 'app-pre-inscription',
  templateUrl: './pre-inscription.component.html',
  styleUrls: ['./pre-inscription.component.css']
})
export class PreInscriptionComponent {
  userSelection: string = 'true';
  show_doc: boolean = false
  myForm: FormGroup;
  register_id: any
  selectedFile: File | null = null;
  cin_img: string | null = null;
  selectedFile1: File | null = null;
  permis_img: string | null = null;
  carRegistration_img: string | null = null;
  Passport_img: string | null = null;

  constructor(private inscriptionservice: StudentService, private fb: FormBuilder, private router: Router) {
    this.register_id = localStorage.getItem('register_id')
    this.myForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      cin: ['', Validators.required],
      level: ['', Validators.required],
      baccalaureate: [false, Validators.required],
      code: [' ', Validators.required],
      adresse: ['', Validators.required],
      phone: ['', Validators.required],
      brith_date: ['', Validators.required],
      sexe: ['', Validators.required],
      annee: ['', Validators.required],
      departement: ['', Validators.required],
      classe: ['', Validators.required],
      situation: ['']
    });

  }

  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }
  classes: any
  get_classes_bydep(departement: any) {
    this.inscriptionservice.get_classes_bydep(departement).subscribe({
      next: (res) => {


        this.classes = res
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    })
  }
  logForm1() {
    if (this.myForm.valid) {


      this.inscriptionservice.createinscrption(this.myForm.value, this.register_id)
        .subscribe({
          next: (res) => {


            // Handle the response from the server

            this.router.navigate([clientName + '/personaldoc']);
          },
          error: (e) => {
            // Handle errors
            console.error(e);
          }
        });
    } else {
      console.error('Form is invalid');
    }
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

  show_div_doc() {
    if (this.areAllFieldsFilled() == false) {

      this.myForm.markAllAsTouched();
      this.myForm.markAsPristine()
      this.show_doc = false

      return;
    }

    else {


      this.show_doc = true
    }

  }
  logForm(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);



      const formData = new FormData();

      formData.append('firstName', this.myForm.value.firstName);
      formData.append('lastName', this.myForm.value.lastName);
      formData.append('email', this.myForm.value.email);
      formData.append('phoneNumber', this.myForm.value.phoneNumber);
      formData.append('dateOfBirth', this.myForm.value.birthDate);
      formData.append('location', this.myForm.value.lieuNaissance);
      formData.append('nationality', this.myForm.value.pays);
      formData.append('portage', this.myForm.value.portage)
      const payload = {
        'firstName': this.myForm.value.firstName,
        'lastName': this.myForm.value.lastName,
        'email': this.myForm.value.email,
        'phoneNumber': this.myForm.value.phoneNumber,
        'dateOfBirth': this.myForm.value.birthDate,
        'location': this.myForm.value.lieuNaissance,
        'nationality': this.myForm.value.pays,
        'portage': this.myForm.value.portage
      }

      console.log('Form Data:', this.myForm.value);
      console.log(headers);
      if (this.myForm.pristine) {
        this.myForm.markAllAsTouched();
        // this.voitureForm.markAllAsTouched()
        return;
      } else {
        this.inscriptionservice.createinscrption(payload, this.myForm.value)
          .subscribe({
            next: (res) => {


              // Handle the response from the server
              console.log(res);
              this.router.navigate([clientName + '/personaldoc']);
            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });


      }
    }
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
