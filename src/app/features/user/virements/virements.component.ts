import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis
} from "ng-apexcharts";
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';


export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  chart1: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
  markers: ApexMarkers | any;
  yaxis: ApexYAxis | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  colors: any
};

@Component({
  selector: 'app-virements',
  templateUrl: './virements.component.html',
  styleUrls: ['./virements.component.css']
})
export class VirementsComponent {
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  @ViewChild("chart") chart: ChartComponent | any;
  selectedType: string = 'all';
  date: string = 'year'
  public chartOptions: Partial<ChartOptions> | any;
  user_id: any
  res: any
  myForm: FormGroup;
  DocPersolForm: FormGroup
  stats: any
  show_chart: boolean = false
  constructor(private userservice: UserService, private consultantservice: ConsultantService, private studentservice: StudentService, private socketService: WebSocketService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.
    this.DocPersolForm = this.fb.group({
      note1: ['', Validators.required],
      // Add other controls for the additional form as needed
    });
    this.myForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      cin: ['', [Validators.required, Validators.email]],
      level: ['', Validators.required],
      code: ['', Validators.required],
      location: ['', Validators.required],
      adresse: ['', Validators.required],
      phone: ['', Validators.required],
      brith_date: ['', Validators.required],
      sexe: ['', Validators.required],
      departement: ['', Validators.required],
      classe: ['', Validators.required],
      cin_img: ['', Validators.required],
      transcripts: ['', Validators.required],
      baccalaureate: ['', Validators.required],
      father_name: ['', Validators.required],
      mother_name: ['', Validators.required],
      mother_phone: ['', Validators.required],
      father_phone: ['', [Validators.required, Validators.email]],
      father_job: ['', Validators.required],
      mother_job: ['', Validators.required],

    });
    this.user_id = localStorage.getItem('user_id')





  }
  note1_img: any
  note2_img: any
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  pdfcontainer1: any
  notification: string[] = [];
  res1: any
  pageSize = 8; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  preinscription_id: any
  res2: any
  shownotiff: boolean = false
  edit() {

    const formData = new FormData();

    // Append the identificationDocument file
    // const identificationDocumentFile = this.myForm.value.identificationDocument;
    // formData.append('identificationDocument', identificationDocumentFile);
    // Append values directly to formData
    formData.append('first_name', this.myForm.value.first_name);
    formData.append('last_name', this.myForm.value.last_name);
    formData.append('cin', this.myForm.value.cin);
    formData.append('level', this.myForm.value.level);
    formData.append('code', this.myForm.value.code);
    formData.append('adresse', this.myForm.value.adresse);
    formData.append('phone', this.myForm.value.phone);
    formData.append('brith_date', this.myForm.value.brith_date);
    // formData.append('cin_img', this.docs.cin_img.split('uploads/')[1]);
    formData.append('sexe', this.myForm.value.sexe);
    formData.append('departement', this.myForm.value.departement);
    // formData.append('transcripts', this.docs.transcripts.split('uploads/')[1]);
    formData.append('classe', this.myForm.value.classe);
    formData.append('father_name', this.myForm.value.father_name);
    formData.append('mother_name', this.myForm.value.mother_name);
    formData.append('mother_phone', this.myForm.value.mother_phone);
    formData.append('father_phone', this.myForm.value.father_phone);
    formData.append('father_job', this.myForm.value.father_job);
    formData.append('mother_job', this.myForm.value.mother_job);
    // formData.append('baccalaureate', this.docs.baccalaureate.split('uploads/')[1]);





    // Display confirmation popup
    Swal.fire({
      title: 'Confirmer les modifications',
      text: "Êtes-vous sûr de vouloir mettre à jour la demande de pré-inscription ?",
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettez à jour !',
      confirmButtonColor: "rgb(0, 17, 255)",

      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'custom-confirm-button-class'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.myForm.value.level);

        if (this.myForm.value.level === 2) {
          const formData1 = new FormData();
          // Assuming these are the file input names in your form 
          const note1 = this.fileInputs.note1.files[0];

          formData1.append('note1', note1)
          this.studentservice.addnote1(formData1, this.preinscription_id).subscribe({
            next: (res) => {

            }
          })
        }
        else {
          const formData1 = new FormData();
          // Assuming these are the file input names in your form 
          const note1 = this.fileInputs.note1.files[0];
          const note2 = this.fileInputs.note2.files[0];

          formData1.append('note1', note1)
          formData1.append('note2', note2)
          this.studentservice.addnote2(formData1, this.preinscription_id).subscribe({
            next: (res) => {

            }
          })
        }
        // User clicked 'Yes', call the endpoint
        const payload = {
          "personalInfo": {
            "first_name": this.myForm.value.first_name,
            "last_name": this.myForm.value.last_name,
            "cin": this.myForm.value.cin,
            "level": this.myForm.value.level,
            "baccalaureate": this.personalInfo.baccalaureate,
            "annee": this.personalInfo.annee,
            "code": this.personalInfo.code,
            "adresse": this.myForm.value.adresse,
            "phone": this.myForm.value.phone,
            "brith_date": this.myForm.value.brith_date,
            "sexe": this.myForm.value.sexe,
            "departement": this.myForm.value.departement,
            "classe": this.myForm.value.classe
          },
          "student_family": {
            "father_name": this.myForm.value.father_name,
            "mother_name": this.myForm.value.mother_name,
            "mother_phone": this.myForm.value.mother_phone,
            "father_phone": this.myForm.value.father_phone,
            "father_job": this.myForm.value.father_job,
            "mother_job": this.myForm.value.mother_job
          }
        }
        this.studentservice.update_register(payload, this.preinscription_id).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire({
              icon: "success",
              title: 'Pré-inscription mise à jour avec succès !',
              confirmButtonText: 'OK',
              confirmButtonColor: "rgb(0, 17, 255)",
            });
            this.router.navigate([clientName + '/pending'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            // Set loading to false in case of an error

          }
        });
      } else {
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          icon: 'info',
          iconColor: '#1E1E1E',

          confirmButtonText: 'Ok',
          confirmButtonColor: "#1E1E1E",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });


  }
  // Assuming you have an object to hold file inputs
  fileInputs: any = {};
  fileName: string = '';
  img_profil: any
  selectedFile: any | null = null;
  cin_img: string | null = null;
  bac_img: string | null = null;
  selectedFile1: File | null = null;
  permis_img: string | null = null;
  carRegistration_img: string | null = null;
  Passport_img: string | null = null;
  ribdoc_img: string | null = null;
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
        else if (field == 'note1') {
          this.note1_img = e.target!.result as string;
        }
        else if (field == 'note2') {
          this.note2_img = e.target!.result as string;

        }
        else {
          this.bac_img = e.target!.result as string;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  status_preregister: any
  personalInfo: any
  familyinfo: any
  docs: any
  role: any
  fullname: any
  ngOnInit(): void {
    this.preinscription_id = localStorage.getItem('register_id');
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
    this.studentservice.getinscrption(this.preinscription_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

        this.status_preregister = res.preregister.status
        this.personalInfo = res.preregister.personalInfo;
        this.familyinfo = res.preregister.family_info;
        this.docs = res.preregister.docs
        this.docs.cin = baseUrl + "uploads/" + this.docs.cin
        this.docs.transcripts = baseUrl + "uploads/" + this.docs.transcripts
        if (this.docs.baccalaureate) {
          this.docs.baccalaureate = baseUrl + "uploads/" + this.docs.baccalaureate
        }

        this.docs.img_profil = baseUrl + "uploads/" + this.docs.img_profil


        this.personalInfo.brith_date = this.personalInfo.brith_date.split('T')[0]


        if (this.personalInfo.identificationDocument.value.endsWith('.pdf')) {
          console.log(this.personalInfo.identificationDocument.value);

          // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.personalInfo.identificationDocument.value).subscribe({
          //   next: (res) => {
          //     this.pdfData = res;
          //     this.identificationDocumentpdf = true;
          //     if (this.pdfData) {
          //       this.handleRenderPdf1(this.pdfData);
          //     }
          //   },
          // });

        }
        this.personalInfo.carInfo.drivingLicense.value = baseUrl + "uploads/" + this.personalInfo?.carInfo.drivingLicense.value
        // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.missionInfo.isSimulationValidated.value).subscribe({
        //   next: (res) => {
        //     this.pdfData = res;
        //     this.isLoading = false;
        //     if (this.pdfData) {
        //       this.handleRenderPdf(this.pdfData);
        //     }
        //   },
        // });

        // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.personalInfo.ribDocument.value).subscribe({
        //   next: (res) => {
        //     this.pdfData = res;
        //     this.isLoading = false;
        //     if (this.pdfData) {
        //       this.handlesecondRenderPdf(this.pdfData);
        //     }
        //   },
        // });






      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
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
    this.consultantservice.getallnotification(user_id).subscribe({
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
        this.res2 = res
        console.log('inffffffffoooooo', this.res);






      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        if (res.length > 0) {
          // Sort the response array by createdAt in ascending order
          this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);

          this.res = this.res.map((item: any) => ({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
        }
        else {
          this.res = []
        }


      },
      error: (e) => {

        console.error("eeeeeeeeeeeeeeeeeeee", e);
        // Set loading to false in case of an error
      }
    });



  }
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.res.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.res.length);


    return this.res.slice(startIndex, endIndex);
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
  getmyvir() {

    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        // Sort the response array by createdAt in ascending order
        this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);

        this.res = this.res.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  filterByType(selectedType: string, date: any) {

    this.userservice.virementByPeriod(this.user_id, selectedType, date).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          // Sort the filtered response array by createdAt in descending order
          this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
          this.res = this.res.map((item: any) => ({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
        } else {
          // Handle case when response is empty
          this.res = [];
        }
      },
      error: (err) => {
        this.res = [];
        console.error('Error occurred while fetching data:', err);
        // Handle error gracefully
      }
    });

  }




  // virementByPeriod() {
  //   this.userservice.virementByPeriod(this.date, this.user_id).subscribe({
  //     next: (res: any[]) => { // Assuming res is an array of objects
  //       // Sort the response array by createdAt in descending order
  //       this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);
  //       this.res = this.res.map((item: any) => ({
  //         ...item,
  //         createdAt: this.formatDate(item.createdAt),
  //       }));
  //     },
  //   } as any);
  // }


}
