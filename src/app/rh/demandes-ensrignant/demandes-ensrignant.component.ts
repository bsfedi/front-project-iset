import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
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

  constructor(private fb: FormBuilder, private studentservice: StudentService, private router: Router) {
    this.myForm2 = this.fb.group({
      user_id: [''],
      type: ['', Validators.required],

      month: ['']
    });

    this.myForm3 = this.fb.group({
      user_id: [''],
      Adresse: [''],
      type: ['CONGE'],
      type_conge: [''],
      date_debut: [''],
      date_fin: [''],
      heure_debut: [''],
      heure_fin: [''],
    });

  }

  expanded: boolean = false;
  selectedTeachers: string[] = [];

  toggleTeacher(teacher: string): void {
    const index = this.selectedTeachers.indexOf(teacher);
    if (index === -1) {
      this.selectedTeachers.push(teacher);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
  }

  toggleCheckboxes(): void {
    this.expanded = !this.expanded;
  }

  monthes = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  putfiche(id: any) {
    this.studentservice.putfiche(id).subscribe({
      next: (res) => {
        window.location.reload()
      }, error(e) {
        console.log(e);

      }
    });
  }

  fullname: any
  show: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    } else if (this.role == 'RH') {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.first_name + " " + res.last_name
          this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
            next: (res) => {
              this.studentservice.getfiche().subscribe({
                next: (res) => {
                  this.validated_mission = res


                },
                error: (e) => {
                  // Handle errors
                  this.validated_mission = [];
                  console.error(e);

                  // Set loading to false in case of an error
                },
              });
            }, error(e) {
              console.log(e);

            }
          });
        }, error(e) {
          console.log(e);

        }
      });


    }
    else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
          this.studentservice.enseignants_demande(this.user_id).subscribe({
            next: (res) => {
              this.validated_mission = res.at_demandes

              this.show = true
            },
            error: (e) => {
              // Handle errors
              this.validated_mission = [];
              console.error(e);

              // Set loading to false in case of an error
            },
          });
        }, error(e) {
          console.log(e);

        }
      });
    }
    this.user_id = localStorage.getItem('user_id')
    this.role = localStorage.getItem('role')



  }
  pageSizepending = 8; // Number of items per page
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
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }

  demandeaverification() {
    this.myForm2.value.user_id = this.user_id
    if (this.myForm2.value.month === 'autre') {
      this.myForm2.value.month = this.selectedTeachers
    } else {
      this.myForm2.value.month = [this.myForm2.value.month]
    }
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
            confirmButtonColor: "rgb(0, 17, 255)",

            customClass: {
              confirmButton: 'custom-confirm-button-class',
              cancelButton: 'custom-cancel-button-class'
            },
            reverseButtons: true // Reversing button order
          }).then((result) => {
            if (result.isConfirmed) {
              // Reload the page
              location.reload();
            }
          });
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
            confirmButtonColor: "rgb(0, 17, 255)",

            customClass: {
              confirmButton: 'custom-confirm-button-class',
              cancelButton: 'custom-cancel-button-class'
            },
            reverseButtons: true // Reversing button order
          }).then((result) => {
            if (result.isConfirmed) {
              // Reload the page
              location.reload();
            }
          });
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
  pageSize = 8; // Number of items per page
  currentPage = 1; // Current page

  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.validated_mission.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.validated_mission.length);


    return this.validated_mission.slice(startIndex, endIndex);



  }
}
