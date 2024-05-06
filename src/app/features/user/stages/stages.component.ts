import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { jsPDF } from "jspdf";
declare let html2pdf: any
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import Swal from 'sweetalert2';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { UserService } from 'src/app/services/user.service';
import { StudentService } from 'src/app/services/student.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  yaxis: ApexYAxis | any;
  colors: string[] | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
};

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css']
})
export class StagesComponent {
  hideMissions: boolean = true;
  currentDate: Date | undefined;
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  closestEndDate: any | null;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  isMenuOpen2: boolean[] = []
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  pending_missions: any;
  validated_mission: any;
  NotValidated_mission: any;
  daysDiff: any
  clientofcurrentmission: any
  tjmofcurrentmission: any
  datamissions: any[] = []
  show: any
  categories: any[] = []
  formattedDate: any
  @ViewChild("chart") chart: ChartComponent | any;
  chartOptions: Partial<ChartOptions> | any;
  fileInputs: any = {}; // Initialize fileInputs object
  document: string | null = null; // Initialize document property
  selectedFile: any
  myForm: FormGroup;
  myForm2: FormGroup;
  user_id: any
  mission_id: any
  formData = new FormData();
  formData34 = new FormData();
  myForm1: FormGroup;
  tjm_moyen: any
  stats: any;
  cra: string | null = null;
  deposer: any;
  show_demandes: any;
  selectedOption: any;
  form1: boolean = false;
  form2: boolean = false;
  show_chart: boolean = false
  selectedTeachers: string[] = [];
  constructor(private consultantservice: ConsultantService, private fb: FormBuilder, private studentservice: StudentService, private userservice: UserService, private socketService: WebSocketService, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.

    this.getCurrentDate();
    this.myForm2 = this.fb.group({
      user_id: [''],
      type: ['', Validators.required],
      entreprise: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      responsable: ['', Validators.required],
      adresse: ['', Validators.required],
      fax: ['', Validators.required],
      tel: ['', Validators.required],
      departement: [''],
      email_entreprise: ['', Validators.required],
      project: ['', Validators.required],
      encadrent_externe: ['', Validators.required],
      email_encadrent_externe: [''],
      tel_encadrent_externe: [''],
      encadrant_interne: [''],
      fonctionalie: [''],
      classe: [''],
    });
    this.myForm = this.fb.group({
      arabicAttestations: ['', Validators.required], // Assuming this is for the Arabic attestations
      frenchAttestations: ['', Validators.required], // Assuming this is for the French attestations
      selectedTeachers: [[]] // Assuming this is for the selected teachers
    });

    this.myForm1 = this.fb.group({

      craPdf: ['', Validators.required],
      // Add other form controls as needed
    });

    // this.myForm = this.fb.group({
    //   TJM: ['', Validators.required],
    //   datecompte: ['', Validators.required],
    //   userDocument: ['', Validators.required],
    //   // Add other form controls as needed
    // });
  }
  expanded: boolean = false;
  toggleTeacher(teacher: string): void {
    const index = this.selectedTeachers.indexOf(teacher);
    if (index === -1) {
      this.selectedTeachers.push(teacher);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
  }
  toggleCheckboxes() {
    this.expanded = !this.expanded;
  }
  generatePdf(stage_id: any) {
    this.studentservice.generate_lettre(stage_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        const htmlContent = `
        <html>
          <head>
  
          </head>
          <body>
          <b style="margin:10px 10px 30px 120px"> Institut Supérieur des Etudes Technologiques de Nabeul  </b>
          <div style="margin:10px 10px 30px 150px"> <b>Lettre d’affectation à un stage de fin de parcours </b><br>  </div> 
          Le directeur du département Technologies de l’Informatique à l’Institut Supérieur des Etudes  
          Technologiques de Nabeul atteste par la présente que :  <br> <br>
          <b>  L’étudiant</b>  :  ${res.user.personalInfo.first_name}  ${res.user.personalInfo.last_name} <br> <br>
          <b> N° CIN  : </b>   ${res.user.personalInfo.cin}<br> <br>
          <b> Parcours</b>  :  ${res.user.personalInfo.level} <br><br>
          est affecté à un stage de fin de parcours au sein de la société :  <br> <br>
          <b> Société d’accueil :  </b>   ${res.stage.entreprise}  <br> <br>
          et ce pendant la période :   <br><br>
          <b> Date Début  </b> :  ${res.stage.date_debut.split(['T'])[0]} <br><br>
          <b>  Date Fin :  </b>   ${res.stage.date_fin.split(['T'])[0]} <br><br>
          Durant cette période, l’étudiant demeurera assuré par l’institut supérieur des études 
          technologiques de Nabeul.   <br> <br>
          Pendant le stage, l’étudiant est tenu de respecter les consignes de son encadrant  
          professionnel<br>  et de s’aligner sur obligations et règlementations établies par la 
          société d’accueil.  <br>  <br>
          Le travail effectué par l'étudiant au cours de son stage sera évalué par l’entreprise à  <br>
          l'aide d'un formulaire d'évaluation qui sera émis à la fin de la période de stage. Cette  
          évaluation permettra de mesurer les compétences acquises par l'étudiant et sa  
          contribution aux projets auxquels il a été affecté.    <br> <br>
          <b style="margin:10px 10px 30px 500px"> Directeur du département    </b> <br>
          <b style="margin:20px 10px 30px 550px"> ${res.chefdepartement.first_name}  ${res.chefdepartement.last_name}     </b>
          <br>
          <br><br><br><br><br><br><br><br><br><br>
          </body>
        </html>
      `;

        html2pdf(htmlContent, {
          margin: 10,

          filename: 'cra_' + formattedDate + '_' + "this.myinfo.firstName" + '.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

        }).pdf.save('document.pdf'), this.router.navigate([clientName + '/student/requests']);



      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
    const pdf = new jsPDF();
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;


    // Create your HTML content as a string




  }
  generatePdf1(stage_id: any) {
    this.studentservice.generate_lettre(stage_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Poppins', sans-serif !important;
            }
            .custom-class {
              color: red;
            }
            table {
              border-collapse: collapse;
              width: 130%;
            }
            th, td {
              height : 1px;
              padding: 1px;
              text-align: left;
            }
          </style>
        </head>
        <body>
         <b style="margin:10px 10px 30px 120px"> Institut Supérieur des Etudes Technologiques de Nabeul  </b>
          <div style="margin:10px 10px 30px 150px;font-size : 2.5rem">  <b> Demande de Stage </b><br>  </div> 
          <div style="display:flex;">
          <div>
            <b>  </b>
      
            <div style='width: 38.875rem;
                  height: 10.0625rem;
                flex-shrink: 0;
                padding: 15px;
                border-radius: 0.4375rem;
                border: 2px solid black;'>
             <b> Identification de l'etudiant (e) :  </b><br>  <br>
             - Nom et prénom de l'etudiant (e) :  ${res.user.personalInfo.first_name}  ${res.user.personalInfo.last_name}  <br>  <br>
             - Département : ${res.user.personalInfo.departement}  <br>  <br>
             - Type de stage :  ${res.stage.type} <br>  <br>

            </div> <br> 
            Cher Monsieur;
Nous tenons à vous remercier pour votre honorable participation dans le développement des Compétences professionnelles de nos étudiants(e), ainsi pour l'espit que vous déployez pour
consolider leurs formations.
Dans ce cadre, l'ISET de nabeul vous propose d'accorder pour l'étudiant(e) concerné(e)
Un stage de formation de  ${res.stage.date_debut.split(['T'])[0]} au  ${res.stage.date_fin.split(['T'])[0]}  .
<br> <br>
En effet et en vue de nous permettre l'affectation de l'étudiant (e) concerné(e), nous vous prions
de bien vouloir nous communiquer votre proposition dans les plus proches délais.
Veuillez agréer, Monsieur, toute notre gratitude et tout notre respect.  <br>  <br>

<div style='width: 38.875rem;
height: 15.0625rem;
flex-shrink: 0;
padding: 15px;
border-radius: 0.4375rem;
border: 2px solid black;'>
<b> Identification de l'Entreprise (e) :  </b><br>  <br>
- Entreprise :  ${res.stage.entreprise} <br>  <br>
- Adresse : ${res.stage.adresse} <br>  <br>
- Service : ${res.stage.service} <br>  <br>
- Responsable : ${res.stage.responsable}    Téléphone :  ${res.stage.tel}          Fax:  ${res.stage.fax} <br>  <br>
- Email : ${res.stage.email_entreprise}

</div> <br><br><br>

<b style="margin:10px 10px 30px 500px"> Directeur du département    </b> <br>
<b style="margin:20px 10px 30px 550px"> ${res.chefdepartement.first_name}  ${res.chefdepartement.last_name}     </b><br>  <br>  <br> <br>  <br> <br>  <br> <br>  <br>

 
          </div>

          </div>
        </body>
      </html>
    `;

        html2pdf(htmlContent, {
          margin: 10,
          filename: 'cra_' + formattedDate + '.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

        }).pdf.save('document.pdf'), this.router.navigate([clientName + '/student/requests']);





      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
    const pdf = new jsPDF();
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;


    // Create your HTML content as a string




  }
  updateForms() {
    if (this.selectedOption === 'attestation') {
      this.form1 = true;
      this.form2 = false;
    } else if (this.selectedOption === 'verification') {
      this.form1 = false;
      this.form2 = true;
    }
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  getCurrentDate() {
    this.currentDate = new Date();
    console.log(this.currentDate);

  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  submit24(): void {

    if (this.myForm2.valid) {
      console.log('Form submitted:', this.myForm2.value);
      // Here you can perform further actions with the form data
    } else {
      console.log('Form is invalid');
    }

  }
  isDateAfterToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight
    return comparisonDate > currentDate;
  }

  isDateBeforeToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight


    return comparisonDate < currentDate;

  }
  client: any
  deposercra(id: any, client: any) {
    this.deposer = true
    this.mission_id = id
    this.client = client
  }
  isDateToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight
    return comparisonDate.toDateString() === currentDate.toDateString();
  }

  private parseDate(dateToParse: any): Date {
    // Check if the date is already in the 'Dec 30 2023' format
    if (typeof dateToParse === 'string' && dateToParse.match(/^[a-zA-Z]{3} \d{1,2} \d{4}$/)) {
      return new Date(dateToParse);
    }

    // Assume it's in the 'YYYY-MM-DD' format
    return new Date(dateToParse);
  }
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  pdfcontainer1: any
  notification: string[] = [];
  shownotiff: boolean = false
  res: any
  register_id: any
  res1: any
  ens: any
  departement: any
  changewidth: any
  classe: any
  role: any;
  fullname: any
  ngOnInit(): void {

    if (this.myForm2.value.type == 'stage PFE') {
      this.changewidth = true
    }
    this.user_id = localStorage.getItem('user_id')
    this.register_id = localStorage.getItem('register_id')
    this.studentservice.getinscrption(this.register_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res.preregister
        this.show = true
        this.departement = this.res.personalInfo.departement
        this.classe = this.res.personalInfo.classe
        this.studentservice.enseignantsbydepartement(this.res.personalInfo.departement).subscribe({
          next: (res) => {
            this.ens = res
          }
        })

      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
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
    this.studentservice.get_stages(this.register_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res


      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });

    const token = localStorage.getItem('token');

    this.user_id = localStorage.getItem('user_id');
    this.new_notif = localStorage.getItem('new_notif');
    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log(event);

      if (event.notification.toWho == "RH") {
        this.lastnotifications.push(event.notification.typeOfNotification)
        this.nblastnotifications = this.lastnotifications.length
        this.notification.push(event.notification.typeOfNotification)
        localStorage.setItem('new_notif', 'true');
      }

      // Handle your rhNotification event here
    });
    this.consultantservice.getallnotification(this.user_id).subscribe({
      next: (res1) => {
        this.res1 = res1
        this.nblastnotifications = this.res1.length
        this.lastnotifications = this.res1

      },
      error: (e) => {
        this.nblastnotifications = 0
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.userservice.getpersonalinfobyid(this.user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log('inffffffffoooooo', this.res);






      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    // Check if token is available
    if (token) {
      console.log(token);

      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getMyMissions(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server


          this.items = res
          this.nbdemande = this.items.length






        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });

      this.studentservice.getdemandeverification(this.user_id).subscribe({


        next: (res) => {
          this.pending_missions = res


        },
        error: (e) => {
          // Handle errors
          this.pending_missions = []
          console.error(e);
          // Set loading to false in case of an error
        }
      });

      this.studentservice.get_stages(this.user_id).subscribe({
        next: (res) => {
          this.validated_mission = res;


        },
        error: (e) => {
          // Handle errors
          this.validated_mission = [];
          console.error(e);

          // Set loading to false in case of an error
        },
      });

    }
  }
  cin_img: any
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

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  toggleHide() {
    this.hideMissions = !this.hideMissions;


  }

  demandeattestation() {
    const formData12 = {
      "user_id": this.res.user_id,
      "first_name": this.res.personalInfo.first_name,
      "last_name": this.res.personalInfo.last_name,
      "cin": this.res.personalInfo.cin,
      "nb_page": 0,
      "nb_arab": this.myForm.value.arabicAttestations,
      "nb_fr": this.myForm.value.frenchAttestations,
      "code": this.res.personalInfo.code,
      "departement": this.res.personalInfo.departement,
      "classe": this.res.personalInfo.classe,
      // Modified enseignants field
      "enseignants": [
        { "_id": this.selectedTeachers[0], "validated": false },
        { "_id": this.selectedTeachers[1], "validated": false }
      ]
    }

    this.studentservice.demandeattestation(formData12)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajouté avec succès! </div> 
                
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

  demandeaverification() {

    this.myForm2.value.departement = this.departement
    this.myForm2.value.user_id = this.user_id
    this.myForm2.value.classe = this.classe

    console.log(this.myForm2.value.type);

    if (this.myForm2.value.type != "stage PFE") {
      this.studentservice.addstage(this.myForm2.value)
        .subscribe({
          next: (res) => {
            this.showPopup = false

            Swal.fire({

              background: 'white',
              html: `
              <div>
              <div style="font-size:1.2rem"> stage ajouté avec succès! </div> 
                
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
            window.location.reload();

          },
          error: (e) => {
            // Handle errors
            console.error(e);
          }
        });
    }
    else {
      const formData34 = new FormData();
      const cin = this.fileInputs.cin.files[0];
      console.log(cin);


      formData34.append('cahier_charge', cin);
      console.log(formData34);

      this.studentservice.addstagepfe(this.myForm2.value)
        .subscribe({
          next: (res) => {

            this.studentservice.add_cahier_cahrge(res, formData34).subscribe({

              next: (res) => {


                console.log(res);

                Swal.fire({

                  background: 'white',
                  html: `
                  <div>
                  <div style="font-size:1.2rem"> stage ajouté avec succès! </div> 
                    
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

              }
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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  pageSizepending = 5; // Number of items per page
  currentPagepending = 1; // Current page
  totalPagespending: any = 1;
  getDisplayeddocspending(): any[] {


    this.totalPages = Math.ceil(this.pending_missions.length / this.pageSizepending);
    const startIndex = (this.currentPagepending - 1) * this.pageSizepending;
    const endIndex = Math.min(startIndex + this.pageSizepending, this.pending_missions.length);


    return this.pending_missions.slice(startIndex, endIndex);



  }

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



  pageSizenv = 5; // Number of items per page
  currentPagenv = 1; // Current page

  totalPagesnv: any = 1;
  getDisplayeddocsnv(): any[] {


    this.totalPagesnv = Math.ceil(this.NotValidated_mission.length / this.pageSizenv);
    const startIndex = (this.currentPagenv - 1) * this.pageSizenv;
    const endIndex = Math.min(startIndex + this.pageSizenv, this.NotValidated_mission.length);


    return this.NotValidated_mission.slice(startIndex, endIndex);



  }

  nextPagenv() {
    if (this.currentPagenv < this.totalPagesnv) {
      this.totalPagesnv++;
    }
  }

  previousPagenv() {
    if (this.currentPagenv > 1) {
      this.currentPagenv--;
    }
  }

  click() {
    this.showPopup = true
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
  }
  toggleMenu2(i: number) {
    this.isMenuOpen2[i] = !this.isMenuOpen2[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/consultant/details-mission/' + _id])
  }
  gotocra(_id: string) {
    this.router.navigate([clientName + '/CRA/' + _id])
  }
  openPopup(id: any): void {
    this.showPopup = true;
    this.mission_id = id
  }
  openPopup1(): void {
    this.showPopup1 = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.deposer = false;

  }
  idpdf: any


  submitcra() {
    this.formData.append("client", this.client)
    this.consultantservice.addCraPdfToUser(this.mission_id, this.formData)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> cra ajouté avec succès! </div> 
                
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


          this.deposer = false
          // Handle the response from the server
          console.log(res);
          // Additional logic if needed
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          Swal.fire('Error', e.error.error, 'error');
        }
      });

  }
  submit(): void {
    const token = localStorage.getItem('token');

    if (token && this.selectedFile) {

      console.log(this.formData);


      // formData.append('simulation', this.selectedFile);
      this.formData.append('valueOfNewTjm', this.myForm.value.TJM);
      this.formData.append('datecompte', this.myForm.value.datecompte);
      this.formData.append('userId', this.user_id)
      this.formData.append('missionId', this.mission_id)




      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.createTjmRequest(this.formData)
        .subscribe({
          next: (res) => {

            Swal.fire({
              background: 'white',
              confirmButtonColor: "rgb(0, 17, 255)",
              icon: "success",
              title: 'TJM ajouté avec succès!',
              showConfirmButton: false,
              timer: 1500
            });
            this.showPopup = false
            // Handle the response from the server
            console.log(res);
            // Additional logic if needed
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', e.error.message);
          }
        });
    }
  }
}


