import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
const clientName = `${environment.default}`;

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css']
})
export class AbsenceComponent {
  myForm: FormGroup;
  ens = [1, 2, 3, 4]
  selectedOption: string = "";
  inputClass: any;
  inputModule: any;
  inputHoraire: any;
  expanded: boolean = false;
  selectedFile: File | null = null;
  isSimulationValidated: string | null = null;
  constructor(private consultantservice: ConsultantService, private studentsrvice: StudentService, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      durée: ['', Validators.required],
      date: [''],
      date_debut: [''],
      date_fin: ['']


    });
  }
  enseignant_id: any


  logform() {
    console.log(this.fileInputs);

    const formData = new FormData();
    if (this.fileInputs.isSimulationValidated
    ) {
      const isSimulationValidatedeee = this.fileInputs?.isSimulationValidated.files[0];
      formData.append('justificatif', isSimulationValidatedeee);
    }

    formData.append('dureé', this.myForm.value.durée);
    formData.append('date', this.myForm.value.date);
    formData.append('date_debut', this.myForm.value.date_debut);
    formData.append('date_fin', this.myForm.value.date_fin);
    this.studentsrvice.add_absence(formData, this.enseignant_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande ajouté  avec succès! </div> 
              
            </div>
          `,


          confirmButtonText: 'Ok',
          confirmButtonColor: "#91c593",

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
  isEndDateBeforeStartDate(): boolean {
    const endDate = this.myForm.value.endDate;
    const startDate = this.myForm.value.startDate;
    return endDate < startDate;
  }
  toggleCheckboxes() {
    this.expanded = !this.expanded;
  }
  ngOnInit(): void {
    this.enseignant_id = localStorage.getItem('user_id')

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
        this.consultantservice.createNewMission(formData, headers)
          .subscribe({
            next: (res) => {
              // Handle the response from the server
              console.log(res);
              // this.router.navigate([clientName +'/client']);
              // this.router.navigate([clientName +'/informations/' + res._id]);
              this.router.navigate([clientName + '/consultant/missions'])
            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });
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
