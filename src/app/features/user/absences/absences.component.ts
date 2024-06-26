import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent {
  myForm: FormGroup;
  ens = [1, 2, 3, 4]
  show: any
  selectedOption: string = "";
  inputClass: any;
  inputModule: any;
  inputHoraire: any;
  expanded: boolean = false;
  selectedFile: File | null = null;
  isSimulationValidated: string | null = null;
  constructor(private studentsrvice: StudentService, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      user_id: [''],
      choix1: [''],
      choix2: [''],
      choix3: [''],
      choix4: ['']


    });
  }
  enseignant_id: any

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }

  isEndDateBeforeStartDate(): boolean {
    const endDate = this.myForm.value.endDate;
    const startDate = this.myForm.value.startDate;
    return endDate < startDate;
  }
  toggleCheckboxes() {
    this.expanded = !this.expanded;
  }
  user_id: any
  register_id: any
  res: any
  role: any
  departement: any
  fullname: any
  ngOnInit(): void {
    this.enseignant_id = localStorage.getItem('user_id')
    this.user_id = localStorage.getItem('user_id')
    this.register_id = localStorage.getItem('register_id')
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentsrvice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
          console.log(this.fullname);

        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentsrvice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }

    this.studentsrvice.get_absences(this.user_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res

        console.log(this.res);


      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
  }
  logform() {
    this.myForm.value.user_id = this.user_id
    this.studentsrvice.orientation(this.myForm.value).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande ajouté  avec succès! </div> 
              
            </div>
          `,


          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",

          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        })

      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });


  }
  submit(): void {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profession', this.myForm.value.profession);
    formData.append('industrySector', this.myForm.value.industrySector);
    formData.append('finalClient', this.myForm.value.finalClient);
    formData.append('dailyRate', this.myForm.value.dailyRate);
    formData.append('endDate', this.myForm.value.endDate);
    formData.append('startDate', this.myForm.value.startDate);
    const isSimulationValidatedeee = this.fileInputs.isSimulationValidated.files[0];
    formData.append('isSimulationValidated', isSimulationValidatedeee);
    formData.append('email', this.myForm.value.email);
    formData.append('position', this.myForm.value.position);
    formData.append('lastName', this.myForm.value.lastName);
    formData.append('firstName', this.myForm.value.firstName);
    formData.append('company', this.myForm.value.company);
    formData.append('phoneNumber', this.myForm.value.phoneNumber);
    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      console.log('Form Data:', this.myForm.value);


      if (this.areAllFieldsFilled() == false) {
        this.myForm.markAllAsTouched();
        return;
      }
      else {

      }
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
  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'isSimulationValidated') {


          this.isSimulationValidated = e.target!.result as string;
        }
      }
    }
  }
}
