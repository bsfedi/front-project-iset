import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const clientName = `${environment.default}`;
declare let html2pdf: any
@Component({
  selector: 'app-fiche-des-voeux',
  templateUrl: './fiche-des-voeux.component.html',
  styleUrls: ['./fiche-des-voeux.component.css']
})
export class FicheDesVoeuxComponent {
  validated_mission: any
  user_id: any
  list = [1, 2, 3, 4, 5, 6]
  pending_missions: any
  // myForm2: FormGroup;
  wishForm: FormGroup;
  scheduleForm: FormGroup;
  days: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  sessions: string[] = ['S1', 'S2', 'S3', 'S4', 'S5'];

  get modules() {
    return this.wishForm.get('modules') as FormArray;
  }

  addModule() {
    const moduleForm = this.fb.group({
      Classe: ['', Validators.required],
      ChargeTP: [0, Validators.required],
      ChargeCI: [0, Validators.required],
      module: ['', Validators.required]
    });

    this.modules.push(moduleForm);
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  get scheduleArray() {
    return this.scheduleForm.get('schedule') as FormArray;
  }
  constructor(private fb: FormBuilder, private studentservice: StudentService, private router: Router,) {
    this.scheduleForm = this.fb.group({
      schedule: this.fb.array(this.days.map(day => this.fb.group({
        day: day,
        sessions: this.fb.array(this.sessions.map(session => this.fb.control(false)))
      })))
    });
    this.wishForm = this.fb.group({
      nom: [''],
      prenom: [''],
      grade: [''],
      user_id: [''],
      data: [''],
      modules: this.fb.array([]) // Form array for modules
    });

    this.addModule(); // Add initial module
  }



  role: any
  fullname: any
  show: any
  fiche_de_voeux: any
  user_info: any
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  show_new_fiche = false
  shownew() {
    this.show_new_fiche = true
  }
  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      schedule: this.fb.array(this.days.map(day => this.fb.group({
        day: day,
        sessions: this.fb.array(this.sessions.map(session => this.fb.control(false)))
      })))
    });
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
          this.user_info = res
          if (res.role == 'enseignant') {
            this.studentservice.get_fiche_de_voeux(res._id).subscribe({
              next: (res) => {
                this.show = true
                this.fiche_de_voeux = res

              },
              error: (e) => {
                // Handle errors
                this.validated_mission = [];
                console.error(e);

                // Set loading to false in case of an error
              },
            });
          } else {
            this.studentservice.all_fiches().subscribe({
              next: (res) => {
                this.show = true
                this.fiche_de_voeux = res
                console.log(this.fiche_de_voeux);

              },
              error: (e) => {
                // Handle errors
                this.validated_mission = [];
                console.error(e);

                // Set loading to false in case of an error
              },
            });

          }

          this.fullname = res.first_name + " " + res.last_name


        }, error(e) {
          console.log(e);

        }
      });
    }
    this.user_id = localStorage.getItem('user_id')
    this.studentservice.validated_rattrapage().subscribe({
      next: (res) => {
        this.show = true
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
  onSubmit() {
    this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
      next: (res) => {
        this.show = true
        this.wishForm.value.nom = res.first_name
        this.wishForm.value.prenom = res.last_name
        this.wishForm.value.grade = res.grade
        this.wishForm.value.user_id = this.user_id
        this.fullname = res.first_name + " " + res.last_name
        const selectedData = this.scheduleForm.value.schedule.map((dayGroup: any) => ({
          day: dayGroup.day,
          sessions: dayGroup.sessions
        }));
        this.wishForm.value.data = selectedData
        this.studentservice.fiche_de_voeux(this.wishForm.value).subscribe({
          next: (res) => {
            Swal.fire({

              background: 'white',
              html: `
              <div>
              <div style="font-size:1.2rem"> Matières ajoutée  avec succès! </div> 
    
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
      }, error(e) {
        console.log(e);

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

  onCheckboxChange() {
    const selectedData = this.scheduleArray.controls.map((dayGroup: any, i: number) => ({
      day: this.days[i],
      sessions: this.sessions.filter((session, j) => dayGroup.value.sessions[j])
    }));
    console.log(selectedData);
  }


  closePopup2(): void {
    this.showPopup2 = false;

  }

  absences: any
  generatePdf(id: any) {
    this.studentservice.fiche_de_voeux_by_id(id).subscribe({
      next: (res) => {
        this.absences = res;

        // Generate PDF once data is loaded
        this.generatePdfFromData();
      },
      error: (e) => {
        // Handle errors
        this.absences = [];
        console.error(e);
      },
    });
  }



  generatePdfFromData() {
    // Get the data for the first table
    const displayedDocs = this.absences.modules;

    // Check if displayedDocs is an array
    if (!Array.isArray(displayedDocs)) {
      console.error('Invalid data format:', displayedDocs);
      return;
    }

    // Generate the table headers for the first table
    const tableHeaders = `
    <thead>
      <tr>
        <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Priorité</th>
        <th>Matière</th>
        <th>Classe</th>
        <th>CI</th>
        <th style="border-radius: 0rem 0.6875rem 0rem 0rem">TP</th>
      </tr>
    </thead>
  `;

    // Generate the table rows for the first table
    const tableRows = displayedDocs.map((item: any, index: number) => {
      return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.module}</td>
        <td>${item.Classe}</td>
        <td>${item.ChargeCI}</td>
        <td>${item.ChargeTP}</td>
      </tr>
    `;
    }).join('');

    // Get the data for the second table (assuming 'scheduleArray', 'days', and 'sessions' are defined in your component)

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Adjust 'days' as per your requirement
    const sessions = ['S1', 'S2', 'S3', 'S4', 'S5']; // Adjust 'sessions' as per your requirement

    // Generate the table headers for the second table
    const table2Headers = `
    <thead>
      <tr>
        <th>Jours Choisis</th>
        ${sessions.map(session => `
          <th>${session}<br>
            <span *ngIf="session === 'S1'">(08:30–10:00)</span>
            <span *ngIf="session === 'S2'">(10:15–11:45)</span>
            <span *ngIf="session === 'S3'">(13:00–14:30)</span>
            <span *ngIf="session === 'S4'">(14:45–16:15)</span>
            <span *ngIf="session === 'S5'">(16:30–18:00)</span>
          </th>
        `).join('')}
      </tr>
    </thead>
  `;

    // Generate the table rows for the second table
    const table2Rows = this.days.map((day, i) => {
      return `
      <tr>
        <td>${day}</td>
        ${sessions.map((session, j) => `
          <td>
            <input type="checkbox" >
          </td>
        `).join('')}
      </tr>
    `;
    }).join('');

    // Create the HTML content
    const htmlContent = `
    <html>
      <head>
        <style>
           table {
                width: 90%;
                margin-top: 20px;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
        </style>
      </head>
      <body>
        <div style="text-align:center;display:flex">
          <img src="/assets/logoisetnabeul.jpg" style="width:20%;height:20%">
          <div style="margin-top:30px">
            Ministère de l’Enseignement Supérieur et de la Recherche Scientifique<br>
            Direction Générale des Etudes Technologiques<br>
            Institut Supérieur des Etudes Technologiques de Nabeul
          </div>
        </div>
        <br>
              <h1> FICHE DE VŒUX </h1>
          <b> Nom : </b> ${this.absences.nom} <br>
         <b> Prenom : </b> ${this.absences.prenom} <br>
           <b> Grade : </b> ${this.absences.grade} <br>
        <table>
          ${tableHeaders}
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <br><br>
        <table>
        <th> Jours Choisis </th>
     
                                    <th *ngIf="session === 'S1'">(08:30–10:00)</th>
                                    <th *ngIf="session === 'S2'">(10:15–11:45)</th>
                                    <th *ngIf="session === 'S3'">(13:00–14:30)</th>
                                    <th *ngIf="session === 'S4'">(14:45–16:15)</th>
                                    <th *ngIf="session === 'S5'">(16:30–18:00)</th>
                               
          <tbody>
            ${table2Rows}
          </tbody>
        </table>
        <br><br>
      </body>
    </html>
  `;

    // Generate PDF from HTML content
    html2pdf().from(htmlContent).set({
      margin: 10,
      filename: 'fiche_de_voeux.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).save();
  }



  // generatePdfFromData() {
  //   // Get the data for the table
  //   const displayedDocs = this.absences.modules;

  //   // Generate the table headers dynamically (they are the same as the template)
  //   const tableHeaders = `
  //     <thead>
  //       <tr>
  //         <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Priorité</th>
  //         <th>Matière</th>
  //         <th>Classe</th>
  //         <th>CI</th>
  //         <th style="border-radius: 0rem 0.6875rem 0rem 0rem">TP</th>
  //       </tr>
  //     </thead>
  //   `;

  //   // Generate the table rows dynamically
  //   const tableRows = displayedDocs.map((item: any, index: number) => {

  //     return `
  //       <tr>
  //         <td>${index + 1}</td>
  //         <td>${item.module}</td>
  //         <td>${item.Classe}</td>
  //         <td>${item.ChargeCI}</td>
  //         <td>${item.ChargeTP}</td>
  //       </tr>
  //     `;
  //   }).join('');

  //   // Create the HTML content
  //   const htmlContent = `
  //     <html>
  //       <head>
  //         <style>
  //          table {
  //               width: 90%;
  //               margin-top: 20px;
  //               border-collapse: collapse;
  //             }
  //             th, td {
  //               border: 1px solid black;
  //               padding: 8px;
  //               text-align: left;
  //             }
  //         </style>
  //       </head>
  //       <body>
  //         <div style="text-align:center;display:flex">
  //           <img src="/assets/logoisetnabeul.jpg" style="width:20%;height:20%">
  //           <div style="margin-top:30px">
  //             Ministère de l’Enseignement Supérieur et de la Recherche Scientifique<br>
  //             Direction Générale des Etudes Technologiques<br>
  //             Institut Supérieur des Etudes Technologiques de Nabeul
  //           </div>
  //         </div>
  //         <br>
  //         <h1> FICHE DE VŒUX </h1>
  //         <b> Nom : </b> ${this.absences.nom} <br>
  //         <b> Prenom : </b> ${this.absences.prenom} <br>
  //         <b> Grade : </b> ${this.absences.grade} <br>
  //         <table>
  //           ${tableHeaders}
  //           <tbody>
  //             ${tableRows}
  //           </tbody>
  //         </table> <br>
  //         Matières Choisies


  //         <br><br>
  //       </body>
  //     </html>
  //   `;

  //   // Generate PDF from HTML content
  //   html2pdf().from(htmlContent).set({
  //     margin: 10,
  //     filename: 'absences.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  //   }).save();
  // }


  update_salles() {

    // this.studentservice.update_salles(this.module_id, this.myForm2.value).subscribe({
    //   next: (res) => {

    //     Swal.fire({

    //       background: 'white',
    //       html: `
    //       <div>
    //       <div style="font-size:1.2rem"> Parccours modifiée  avec succès! </div> 

    //       </div>
    //     `,


    //       confirmButtonText: 'Ok',
    //       confirmButtonColor: "rgb(0, 17, 255)",

    //       customClass: {
    //         confirmButton: 'custom-confirm-button-class',
    //         cancelButton: 'custom-cancel-button-class'
    //       },
    //       reverseButtons: true // Reversing button order
    //     })


    //   }, error(e) {
    //     console.log(e);

    //   }
    // });

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

    // this.studentservice.add_salle(this.myForm2.value).subscribe({
    //   next: (res) => {
    //     this.showPopup1 = false
    //     Swal.fire({

    //       background: 'white',
    //       html: `
    //         <div>
    //         <div style="font-size:1.2rem"> Salle ajoutée avec succès ! </div> 

    //         </div>
    //       `,


    //       confirmButtonText: 'Ok',
    //       confirmButtonColor: "rgb(0, 17, 255)",

    //       customClass: {
    //         confirmButton: 'custom-confirm-button-class',
    //         cancelButton: 'custom-cancel-button-class'
    //       },
    //       reverseButtons: true // Reversing button order
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         // Reload the page
    //         window.location.reload()
    //       }
    //     });

    //   }, error(e) {
    //     console.log(e);

    //   }
    // });
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
    // this.myForm2.value.user_id = this.user_id

    // this.studentservice.enseignant_demande(this.myForm2.value)
    //   .subscribe({
    //     next: (res) => {
    //       Swal.fire({

    //         background: 'white',
    //         html: `
    //           <div>
    //           <div style="font-size:1.2rem"> demande ajoutée avec succès! </div> 

    //           </div>
    //         `,


    //         confirmButtonText: 'Ok',
    //         confirmButtonColor: "rgb(0, 17, 255)",

    //         customClass: {
    //           confirmButton: 'custom-confirm-button-class',
    //           cancelButton: 'custom-cancel-button-class'
    //         },
    //         reverseButtons: true // Reversing button order
    //       })
    //       console.log(res);

    //       // Handle the response from the server


    //     },
    //     error: (e) => {
    //       // Handle errors
    //       console.error(e);
    //     }
    //   });
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
