import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-gestion-absences',
  templateUrl: './gestion-absences.component.html',
  styleUrls: ['./gestion-absences.component.css']
})
export class GestionAbsencesComponent {
  validated_mission: [] = []
  user_id: any
  pending_missions: any
  myForm2: FormGroup;
  myForm3: FormGroup;
  myform4: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private studentservice: StudentService) {
    this.myForm2 = this.fb.group({
      code: [''],
      utilisation: ['', Validators.required],
      batiment: [''],
      affectation: ['']
    });
    this.myForm3 = this.fb.group({
      classe: [''],
      enseignant: ['', Validators.required],
      module: [''],

    });
    this.myform4 = this.fb.group({
      date: [''],
      nb_seance: ['', Validators.required],


    });
  }
  cellValue: string = '';
  modules: any
  role: any
  enseignants: any
  fullname: any
  departement: any
  all_classes: any
  all_modules: any
  expanded: boolean = false;
  expanded1: boolean = false;
  expanded2: boolean = false;
  selectedTeachers: string[] = [];
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  toggleTeacher(teacher: string): void {




    const index = this.selectedTeachers.indexOf(teacher);
    if (index === -1) {
      this.selectedTeachers.push(teacher);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
  }
  toggleCheckboxes1() {
    this.expanded1 = !this.expanded1;
  }
  selectedTeachers1: string[] = [];
  toggleTeacher1(teacher: string): void {
    const index = this.selectedTeachers1.indexOf(teacher);
    if (index === -1) {
      this.selectedTeachers1.push(teacher);


    } else {
      this.selectedTeachers1.splice(index, 1);
    }
  }
  toggleCheckboxes2() {
    this.expanded2 = !this.expanded2;
  }
  selectedTeachers2: string[] = [];
  toggleTeacher2(teacher: string): void {
    const index = this.selectedTeachers2.indexOf(teacher);
    if (index === -1) {
      this.selectedTeachers2.push(teacher);
    } else {
      this.selectedTeachers2.splice(index, 1);
    }
  }
  toggleCheckboxes() {
    this.expanded = !this.expanded;
  }
  show: any
  all_moduless: any
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
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.first_name + " " + res.last_name
          this.departement = res.departement
          this.studentservice.get_classe_module_by_dep(res.departement).subscribe({
            next: (res) => {
              this.all_classes = res.all_calsse
              this.all_modules = res.all_modules
            }, error(e) {
              console.log(e);

            }
          });
          this.studentservice.get_all_modules().subscribe({
            next: (res) => {
              this.all_moduless = res


            }
          })

          this.studentservice.enseignantsbydepartement(res.departement).subscribe({
            next: (res) => {
              this.enseignants = res


            }
          })
        }, error(e) {
          console.log(e);

        }
      });
    }
    this.user_id = localStorage.getItem('user_id')
    this.role = localStorage.getItem('role')
    this.studentservice.get_modules_by_enseignant(this.user_id).subscribe({
      next: (res) => {
        this.modulesens = res




      },
      error: (e) => {
        // Handle errors
        this.validated_mission = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });

    this.studentservice.get_modules().subscribe({


      next: (res) => {
        this.modules = res
      },
      error: (e) => {
        // Handle errors
        this.modules = []
        console.error(e);
        // Set loading to false in case of an error
      }
    });


  }
  showPopup1: any

  openPopup1(): void {

    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  modulesens: any
  addabsences() {
    const data = {
      "classe": this.selectedTeachers1,
      "module": this.selectedTeachers2,
      "enseignant": this.selectedTeachers
    }
    this.studentservice.absences(this.myForm3.value).subscribe({
      next: (res) => {
        this.validated_mission = res
        console.log(this.validated_mission);
        Swal.fire({

          background: 'white',
          html: `
          <div>
          <div style="font-size:1.2rem">Affectation du module terminée avecs   succès! </div> 
            
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
        window.location.reload()

      },
      error: (e) => {
        // Handle errors
        this.validated_mission = [];
        console.error(e);

        // Set loading to false in case of an error
      },
    });
  }
  getabsence(event: any) {
    const id = event.target.value;

    this.studentservice.get_students_module(id).subscribe({
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
  }
  show_classe: any
  classes: any
  module_id1: any
  getclasse_bymodule(event: any) {
    {

      const id = event.target.value;
      this.module_id1 = id
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
  show_absences: any
  absences: any
  get_absences_by_classe(event: any) {
    {
      const id = event.target.value;


    }

  }
  students: any
  classe_info: any

  get_students_by_classe(event: any) {
    {
      console.log(event, event.target.value);

      const id = event.target.value;


      this.studentservice.get_classe_by_id(id).subscribe({
        next: (res) => {
          this.classe_info = res
          this.studentservice.get_students_by_classe(this.classe_info.code).subscribe({
            next: (res) => {
              this.students = res

              this.show_absences = true


            },
            error: (e) => {
              // Handle errors
              this.absences = [];
              console.error(e);

              // Set loading to false in case of an error
            },
          });

          this.show_absences = true

        },
        error: (e) => {
          // Handle errors

          console.error(e);

          // Set loading to false in case of an error
        },
      });
      this.studentservice.get_absences_by_classe(id, this.module_id1).subscribe({
        next: (res) => {
          this.absences = res


          this.show_absences = true

        },
        error: (e) => {
          // Handle errors
          this.absences = [];
          console.error(e);

          // Set loading to false in case of an error
        },
      });

    }

  }



  renseigner_absence() {
    {
      const data = {
        "date": this.myform4.value.date,
        "nb_absence": this.myform4.value.nb_seance
      }
      for (let student of this.selectedTeachers) {
        this.studentservice.renseigner_absence(student, this.module_id1, this.classe_info._id, data).subscribe({
          next: (res) => {
            this.absences = res


            this.show_absences = true

          },
          error: (e) => {
            // Handle errors
            this.absences = [];
            console.error(e);

            // Set loading to false in case of an error
          },
        });
      }


    }

  }


  getmodule(event: any) {
    const id = event.target.value;

    this.studentservice.get_modules_by_enseignant(id).subscribe({
      next: (res) => {
        this.validated_mission = [];
        this.modulesens = res
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


    this.totalPages = Math.ceil(this.validated_mission.length / this.pageSizepending);
    const startIndex = (this.currentPagepending - 1) * this.pageSizepending;
    const endIndex = Math.min(startIndex + this.pageSizepending, this.validated_mission.length);


    return this.validated_mission.slice(startIndex, endIndex);



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
