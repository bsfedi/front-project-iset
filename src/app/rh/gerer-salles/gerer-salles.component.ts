import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gerer-salles',
  templateUrl: './gerer-salles.component.html',
  styleUrls: ['./gerer-salles.component.css']
})
export class GererSallesComponent {
  validated_mission: any
  user_id: any
  pending_missions: any
  myForm2: FormGroup;
  constructor(private fb: FormBuilder, private studentservice: StudentService) {
    this.myForm2 = this.fb.group({
      code: [''],
      utilisation: ['', Validators.required],
      batiment: [''],
      affectation: ['']
    });
  }



  role: any
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
    this.studentservice.validated_rattrapage().subscribe({
      next: (res) => {
        this.validated_mission = res
        console.log(this.validated_mission);



      },
      error: (e) => {
        // Handle errors
        this.validated_mission = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });
    this.studentservice.get_salles().subscribe({
      next: (res) => {
        this.pending_missions = res
        console.log(this.validated_mission);



      },
      error: (e) => {
        // Handle errors
        this.validated_mission = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });

  }
  showPopup1: any

  openPopup1(): void {

    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }

  salle_by_id: any
  module_id: any
  rattrapge1: any
  showPopup2: any
  get_salle_by_id(classe_id: any) {
    this.module_id = classe_id
    this.rattrapge1 = true
    this.showPopup2 = true;
    this.studentservice.get_salle_by_id(classe_id).subscribe({
      next: (res) => {

        this.salle_by_id = res


      }, error(e) {
        console.log(e);

      }
    });

  }
  closePopup2(): void {
    this.showPopup2 = false;

  }

  update_salles() {

    this.studentservice.update_salles(this.module_id, this.myForm2.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
          <div>
          <div style="font-size:1.2rem"> Parccours modifiée  avec succès! </div> 
            
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


      }, error(e) {
        console.log(e);

      }
    });

  }
  validated_rattrapage_by_etude(rattrage_id: any) {

    this.studentservice.validated_rattrapage_by_etude(rattrage_id, true).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
          <div>
          <div style="font-size:1.2rem"> Parccours modifiée  avec succès! </div> 
            
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


      }, error(e) {
        console.log(e);

      }
    });

  }
  invalidated_rattrapage_by_etude(rattrage_id: any) {

    this.studentservice.validated_rattrapage_by_etude(rattrage_id, false).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
          <div>
          <div style="font-size:1.2rem"> Parccours modifiée  avec succès! </div> 
            
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


      }, error(e) {
        console.log(e);

      }
    });

  }
  deletesalle(id: any) {

    this.studentservice.deletesalle(id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> parcour supprimée  avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
    });
  }
  add_salle() {

    this.studentservice.add_salle(this.myForm2.value).subscribe({
      next: (res) => {
        this.showPopup1 = false
        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> module ajoutée  avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
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
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajoutée avec succès! </div> 
                
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
