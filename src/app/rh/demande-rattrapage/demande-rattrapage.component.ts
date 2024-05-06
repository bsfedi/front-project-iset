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
  selector: 'app-demande-rattrapage',
  templateUrl: './demande-rattrapage.component.html',
  styleUrls: ['./demande-rattrapage.component.css']
})
export class DemandeRattrapageComponent {
  myForm: FormGroup;
  myForm1: FormGroup;
  myForm2: FormGroup;
  myForm3: FormGroup;
  myForm4: FormGroup;
  myForm5: FormGroup;
  show: any
  ens: any
  selectedOption: string = "";

  date1: any

  inputClass1: any;
  inputModule1: any;
  inputHoraire1: any;
  type: any
  nb_senace: any

  date2: any
  inputClass2: any;
  inputModule2: any;
  inputHoraire2: any;

  date3: any
  inputClass3: any;
  inputModule3: any;
  inputHoraire3: any;

  date4: any
  inputClass4: any;
  inputModule4: any;
  inputHoraire4: any;

  date5: any
  inputClass5: any;
  inputModule5: any;
  inputHoraire5: any;


  expanded: boolean = false;
  selectedFile: File | null = null;
  isSimulationValidated: string | null = null;
  constructor(private consultantservice: ConsultantService, private studentservice: StudentService, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      type: ['', Validators.required],
      date: ['', Validators.required],
      nb_senace: [' ', Validators.required]

    });
    this.myForm1 = this.fb.group({
      date: [''],
      inputClass: [''],
      inputModule: [''],
      inputHoraire: ['']

    });
    this.myForm2 = this.fb.group({
      date: [''],
      inputClass: [''],
      inputModule: [''],
      inputHoraire: ['']

    });
    this.myForm3 = this.fb.group({
      date: [''],
      inputClass: [''],
      inputModule: [''],
      inputHoraire: ['']

    });
    this.myForm4 = this.fb.group({
      date: [''],
      inputClass: [''],
      inputModule: [''],
      inputHoraire: ['']

    });
    this.myForm5 = this.fb.group({
      date: [''],
      inputClass: [''],
      inputModule: [''],
      inputHoraire: ['']

    });

  }
  enseignant_id: any
  role: any
  modulesens: any

  fullname: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }

    this.enseignant_id = localStorage.getItem('user_id')
    this.studentservice.get_modules_by_enseignant(this.enseignant_id).subscribe({
      next: (res) => {
        this.modulesens = res


        this.show = true

      },
      error: (e) => {
        // Handle errors
        this.modulesens = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });

    this.studentservice.get_absence_by_enseignant_id(this.enseignant_id)
      .subscribe({
        next: (res) => {
          // Handle the response from the server
          this.ens = res
          // this.router.navigate([clientName +'/client']);
          // this.router.navigate([clientName +'/informations/' + res._id]);

        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });

  }

  show_classe: any
  classes: any
  getclasse_bymodule(event: any) {
    {
      const id = event.target.value;

      this.studentservice.get_classe_by_module(id).subscribe({
        next: (res) => {
          this.classes = res


          this.show_classe = true

        },
        error: (e) => {
          // Handle errors
          this.classes = [];
          console.error(e);

          // Set loading to false in case of an error
        },
      });
    }

  }


  submitAll() {
    console.log(this.myForm1.value, this.myForm2.value, this.myForm3.value, this.myForm4.value, this.myForm5.value);
    const emptyForms = [];
    emptyForms.push(this.myForm1.value, this.myForm2.value, this.myForm3.value, this.myForm4.value, this.myForm5.value)
    const data = {
      "type": this.myForm.value.type,
      "data": emptyForms
    }
    this.studentservice.add_rattrapage(data, this.enseignant_id)
      .subscribe({
        next: (res) => {
          // Handle the response from the server

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
  isEndDateBeforeStartDate(): boolean {
    const endDate = this.myForm.value.endDate;
    const startDate = this.myForm.value.startDate;
    return endDate < startDate;
  }
  toggleCheckboxes() {
    this.expanded = !this.expanded;
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
              this.router.navigate([clientName + '/student/requests'])
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

