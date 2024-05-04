import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demandes-ensrignant',
  templateUrl: './demandes-ensrignant.component.html',
  styleUrls: ['./demandes-ensrignant.component.css']
})
export class DemandesEnsrignantComponent {
  validated_mission: any
  user_id: any
  pending_missions: any
  role: any
  myForm2: FormGroup;
  myForm3: FormGroup;
  constructor(private fb: FormBuilder, private studentservice: StudentService) {
    this.myForm2 = this.fb.group({
      user_id: [''],
      type: ['', Validators.required],
      month: ['']
    });

    this.myForm3 = this.fb.group({
      user_id: [''],
      type: ['CONGE'],
      type_conge: [''],
      date_debut: [''],
      date_fin: [''],
      heure_debut: [''],
      heure_fin: [''],
    });

  }




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
    this.user_id = localStorage.getItem('user_id')
    this.role = localStorage.getItem('role')
    this.studentservice.enseignants_demande(this.user_id).subscribe({
      next: (res) => {
        this.validated_mission = res.at_demandes


      },
      error: (e) => {
        // Handle errors
        this.validated_mission = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });
  }
  pageSizepending = 5; // Number of items per page
  currentPagepending = 1; // Current page
  totalPagespending: any = 1;
  nextPagepending() {
    if (this.currentPagepending < this.totalPagespending) {
      this.currentPagepending++;
    }
  }

  previousPagepending() {
    if (this.currentPagepending > 1) {
      this.currentPagepending--;
    }
  }


  demandeaverification() {
    this.myForm2.value.user_id = this.user_id

    this.studentservice.enseignant_demande(this.myForm2.value)
      .subscribe({
        next: (res) => {
          this.showPopup = false
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajoutée avec succès! </div> 
                
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
          console.log(res);

          // Handle the response from the server


        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });
  }
  agent_demande() {
    this.myForm3.value.user_id = this.user_id

    this.studentservice.agent_demande(this.myForm3.value)
      .subscribe({
        next: (res) => {
          this.showPopup = false
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajoutée avec succès! </div> 
                
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
          console.log(res);

          // Handle the response from the server


        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });
  }

  getDisplayeddocspending(): any[] {


    this.totalPages = Math.ceil(this.pending_missions.length / this.pageSizepending);
    const startIndex = (this.currentPagepending - 1) * this.pageSizepending;
    const endIndex = Math.min(startIndex + this.pageSizepending, this.pending_missions.length);


    return this.pending_missions.slice(startIndex, endIndex);



  }
  showPopup: boolean = false;
  closePopup(): void {
    this.showPopup = false;

  }
  click() {
    this.showPopup = true
  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page

  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.validated_mission.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.validated_mission.length);


    return this.validated_mission.slice(startIndex, endIndex);



  }
}
