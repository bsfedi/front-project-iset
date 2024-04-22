import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

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
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent {
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
      type: ['', Validators.required],
      matiere: ['', Validators.required],
      note: ['', Validators.required],
      commentaire: ['', Validators.required]
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
  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id')
    this.register_id = localStorage.getItem('register_id')

    this.studentservice.getinscrption(this.register_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res.preregister
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
    this.consultantservice.virementstatusbar(this.user_id).subscribe({

      next: (res) => {
        this.stats = res
        const customColors: string[] = ['#FCE9A4', '#C8E1C3',] // Replace with your desired colors

        // Generate fake data for the chart
        const generateFakeData = (length: any) => {
          const currentDate = new Date();
          const startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - length);

          const fakeData = [];
          for (let i = 0; i < length; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            fakeData.push(date.toISOString());
          }

          return fakeData;
        };

        // Generate fake series data
        const generateFakeSeriesData = (length: any) => {
          const fakeData = [];
          for (let i = 0; i < length; i++) {
            fakeData.push(Math.floor(Math.random() * 100));
          }
          return fakeData;
        };

        // Set the number of data points you want
        const numberOfDataPoints = 10;
        if (this.stats.series[0].name) {
          this.show_chart = true
          const customColors: string[] = ['#FCE9A4', '#C8E1C3',] // Replace with your desired colors

          this.chartOptions = {
            series: [
              {
                name: this.stats.series[0].name,
                data: this.stats.series[0].data,
              },
              {
                name: this.stats.series[1].name,
                data: this.stats.series[1].data,
              },
              // Add more series if needed
            ],
            chart: {
              toolbar: {
                show: true, // Show or hide the toolbar
                tools: {
                  download: true, // Show or hide the download option in the toolbar
                  selection: true, // Show or hide the selection tool in the toolbar
                  zoom: false, // Show or hide the zoom tool in the toolbar
                  zoomin: true, // Show or hide the zoom in button in the toolbar
                  zoomout: true, // Show or hide the zoom out button in the toolbar
                  pan: false, // Show or hide the pan tool in the toolbar
                  reset: true, // Show or hide the reset zoom button in the toolbar
                  customIcons: [] // Custom icons for the toolbar, e.g., [{icon: 'image-url', click: function() { // Custom action }}]
                },
                autoSelected: 'zoom' // Automatically select the tool on chart render, options: 'zoom', 'pan', 'selection', null
              },
              animations: {
                enabled: true, // Enable or disable animations
                easing: 'easeout', // Easing function for animations, options: 'linear', 'easein', 'easeout', 'easeinout', etc.
                speed: 800, // Animation speed in milliseconds
                animateGradually: {
                  enabled: true, // Enable or disable gradual animation for chart updates
                  delay: 150 // Delay in milliseconds between each data point animation
                },
                dynamicAnimation: {
                  enabled: true, // Enable or disable dynamic animation for chart updates
                  speed: 300 // Animation speed in milliseconds for dynamic animations
                }
              },
              height: 250,
              type: "area",
              // Background color
            },
            colors: ['#FCE9A4', '#C8E1C3'],  // Line colors
            stroke: {
              width: 2,
              curve: "smooth",
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              type: "date",
              categories: this.stats.categories

            },
          };
        }
        else {
          this.stats.series[0].name = []
          this.stats.series[0].data = []
          this.stats.series[1].name = []
          this.stats.series[1].data = []
          this.stats.categories = []
          this.chartOptions = {
            series: [
              {
                name: [],
                data: [],
              },
              {
                name: [],
                data: [],
              },
              // Add more series if needed
            ],
            chart: {

              height: 250,
              type: "area",
              toolbar: {
                show: true, // Show or hide the toolbar
                tools: {
                  download: true, // Show or hide the download option in the toolbar
                  selection: true, // Show or hide the selection tool in the toolbar
                  zoom: false, // Show or hide the zoom tool in the toolbar
                  zoomin: true, // Show or hide the zoom in button in the toolbar
                  zoomout: true, // Show or hide the zoom out button in the toolbar
                  pan: false, // Show or hide the pan tool in the toolbar
                  reset: true, // Show or hide the reset zoom button in the toolbar
                  customIcons: [] // Custom icons for the toolbar, e.g., [{icon: 'image-url', click: function() { // Custom action }}]
                },
                autoSelected: 'zoom' // Automatically select the tool on chart render, options: 'zoom', 'pan', 'selection', null
              },
              animations: {
                enabled: true, // Enable or disable animations
                easing: 'easeout', // Easing function for animations, options: 'linear', 'easein', 'easeout', 'easeinout', etc.
                speed: 800, // Animation speed in milliseconds
                animateGradually: {
                  enabled: true, // Enable or disable gradual animation for chart updates
                  delay: 150 // Delay in milliseconds between each data point animation
                },
                dynamicAnimation: {
                  enabled: true, // Enable or disable dynamic animation for chart updates
                  speed: 300 // Animation speed in milliseconds for dynamic animations
                }
              },
              // Background color
            },
            colors: ['#FCE9A4', '#C8E1C3'],  // Line colors
            stroke: {
              width: 2,
              curve: "smooth",
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              type: "date",
              categories: this.stats.categories

            },
          };
        }
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
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

      this.studentservice.getdemandeattestation(this.user_id).subscribe({
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

      // this.consultantservice.getNotValidatedMissions(this.headers).subscribe({
      //   next: (res) => {
      //     if (res.length != 0) {
      //       this.NotValidated_mission = res
      //       console.log(this.NotValidated_mission);


      //     } else {
      //       this.NotValidated_mission = []
      //       console.log(this.NotValidated_mission.length);

      //     }

      //     console.log(this.NotValidated_mission);



      //   },
      //   error: (e) => {
      //     // Handle errors
      //     console.error(e);

      //     this.NotValidated_mission = []

      //     // Set loading to false in case of an error

      //   }
      // });

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
      "enseignants": this.selectedTeachers,
      "code": this.res.personalInfo.code,
      "departement": this.res.personalInfo.departement,
      "classe": this.res.personalInfo.classe

    }
    console.log(formData12);

    this.studentservice.demandeattestation(formData12)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajouté avec succès! </div> 
                
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

  demandeaverification() {
    const formData12 = {



      "user_id": this.res.user_id,
      "first_name": this.res.personalInfo.first_name,
      "last_name": this.res.personalInfo.last_name,
      "cin": this.res.personalInfo.cin,
      "type": this.myForm2.value.type,
      "matiere": this.myForm2.value.matiere,
      "note": this.myForm2.value.note,
      "commantaire": this.myForm2.value.commentaire,
      "code": this.res.personalInfo.code,
      "departement": this.res.personalInfo.departement,
      "classe": this.res.personalInfo.classe

    }
    console.log(formData12);

    this.studentservice.demandeverification(formData12)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande ajouté avec succès! </div> 
                
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
  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'document') {

          this.document = e.target!.result as string;

          const document = this.fileInputs.document.files[0];
          // Append the files if they exist, else append empty strings
          this.formData.append('isSimulationValidated', document);
          if (document.name.endsWith('.pdf')) {
            this.idpdf = true
          } else {
            this.idpdf = false
          }

        }
        else if (field == 'cra') {


          this.cra = e.target!.result as string;


          const cra = this.fileInputs.cra.files[0];

          console.log(cra);

          // Append the files if they exist, else append empty strings
          this.formData.append('craPdf', cra);


        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitcra() {
    this.formData.append("client", this.client)
    this.consultantservice.addCraPdfToUser(this.mission_id, this.formData)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> cra ajouté avec succès! </div> 
                
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
              background: '#fefcf1',
              confirmButtonColor: "#91c593",
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
