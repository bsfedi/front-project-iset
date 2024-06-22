import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-personal-doc',
  templateUrl: './personal-doc.component.html',
  styleUrls: ['./personal-doc.component.css']
})
export class PersonalDocComponent {
  userSelection: string = 'false';
  show_doc: boolean = false
  myForm: FormGroup;
  DocPersolForm: FormGroup; // New FormGroup for additional section

  selectedFile: any | null = null;
  cin_img: string | null = null;
  bac_img: string | null = null;
  selectedFile1: File | null = null;
  permis_img: string | null = null;
  carRegistration_img: string | null = null;
  Passport_img: string | null = null;
  ribdoc_img: string | null = null;
  register_id: any
  show_bac: boolean = false

  constructor(private inscriptionservice: StudentService, private fb: FormBuilder, private router: Router) {
    this.register_id = localStorage.getItem('register_id')
    this.inscriptionservice.getinscrption(this.register_id).subscribe({
      next: (res) => {

        this.show_bac = res.preregister.personalInfo.baccalaureate

        // Handle the response from the server


      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
    this.myForm = this.fb.group({

    });
    // Initialize the additional form
    this.DocPersolForm = this.fb.group({
      baccalaureate: ['', Validators.required],
      cin: ['', Validators.required],
      transcripts: ['', Validators.required],
      img_profil: ['', Validators.required]
      // Add other controls for the additional form as needed
    });
  }

  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }
  // Add this method inside your PreInscriptionComponent class
  areAllFieldsFilled(): boolean {
    const formValues = this.DocPersolForm.value;
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

      this.DocPersolForm.markAllAsTouched();
      this.DocPersolForm.markAsPristine()
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




      // formData.append('Passport', Passport);

      if (this.DocPersolForm.pristine) {
        this.DocPersolForm.markAllAsTouched();

        return;
      } else {
        const formData = new FormData();
        // Assuming these are the file input names in your form 
        const cin = this.fileInputs.cin.files[0];
        const transcripts = this.fileInputs.transcripts.files[0];
        const img_profil = this.fileInputs.img_profil.files[0];
        const img_docsupp = this.fileInputs.img_docsupp.files[0] || ''
        formData.append('cin', cin);

        formData.append('transcripts', transcripts)
        formData.append('img_profil', img_profil)

        formData.append('img_docsupp', img_docsupp)

        if (this.show_bac === true) {
          const bac = this.fileInputs.bac.files[0] || ''


          // Append the files if they exist, else append empty strings
          formData.append('baccalaureate', bac);

        } else {
          formData.append('baccalaureate', ''); // Append an empty string

        }

        this.inscriptionservice.createfilesinscrption(formData, this.register_id)
          .subscribe({
            next: (res) => {

              console.log(res);

              // Handle the response from the server
              this.router.navigate([clientName + '/client']);

            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });
      }

    }
  }

  // Assuming you have an object to hold file inputs
  fileInputs: any = {};
  fileName: string = '';
  img_profil: any
  img_docsupp: any
  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'cin') {

          this.cin_img = e.target!.result as string;

        }
        else if (field == 'transcripts') {
          this.ribdoc_img = e.target!.result as string;
        }
        else if (field == 'img_profil') {
          this.img_profil = e.target!.result as string;

        }
        else if (field == 'img_docsupp') {
          this.img_docsupp = e.target!.result as string;
        }
        else {
          this.bac_img = e.target!.result as string;
        }
      };
      reader.readAsDataURL(this.selectedFile);
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
