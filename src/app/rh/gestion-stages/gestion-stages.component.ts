import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';

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
  selector: 'app-gestion-stages',
  templateUrl: './gestion-stages.component.html',
  styleUrls: ['./gestion-stages.component.css']
})
export class GestionStagesComponent {
  hideMissions: boolean = true;
  currentDate: Date | undefined;
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  closestEndDate: any | null;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  isMenuOpen2: boolean[] = []
  show: any
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
  constructor(private fb: FormBuilder, private studentservice: StudentService, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.

    this.getCurrentDate();
    this.myForm2 = this.fb.group({
      note: [''],
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
  godetailsstage(id: any) {
    this.router.navigate([clientName + '/details-stage/' + id])
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
  filteredItems1: any
  res2: any
  role: any
  fullname: any
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
          if (res.role == 'directeuretudes' || res.privilege == 'directeuretudes' || res.role == 'admin') {
            this.studentservice.get_stagess().subscribe({
              next: (res) => {
                // Handle the response from the server
                this.res = res
                this.filteredItems = this.res


              },
              error: (e) => {
                // Handle errors
                console.error(e);
              }
            });
            this.studentservice.get_stages_by_departement_inperff().subscribe({
              next: (res) => {
                // Handle the response from the server
                this.res2 = res
                this.filteredItems1 = this.res2


              },
              error: (e) => {
                // Handle errors
                console.error(e);
              }
            });


          }
          else {
            this.studentservice.get_stages_by_departement(res.departement).subscribe({
              next: (res) => {
                // Handle the response from the server
                this.res = res
                this.filteredItems = this.res


              },
              error: (e) => {
                // Handle errors
                console.error(e);
              }
            });
            this.studentservice.get_stages_by_departement_inperf(res.departement).subscribe({
              next: (res) => {
                // Handle the response from the server
                this.res2 = res
                this.filteredItems1 = this.res2


              },
              error: (e) => {
                // Handle errors
                console.error(e);
              }
            });


          }
        }, error(e) {
          console.log(e);

        }
      });
    }
    if (this.myForm2.value.type == 'stage PFE') {
      this.changewidth = true
    }
    this.user_id = localStorage.getItem('user_id')
    this.departement = localStorage.getItem('departement')

    this.register_id = localStorage.getItem('register_id')



    const token = localStorage.getItem('token');

    this.user_id = localStorage.getItem('user_id');
    this.new_notif = localStorage.getItem('new_notif');



    // Check if token is available
    if (token) {
      console.log(token);

      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);


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
  selectedItems: any[] = [];

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      // If the item is checked, add it to the selectedItems array with an empty note
      this.selectedItems.push({ _id: item, note: '' });
    } else {
      // Remove item if unchecked
      const index = this.selectedItems.findIndex(selected => selected._id === item._id);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  updateNote(event: any, itemId: string) {
    const index = this.selectedItems.findIndex(item => item._id === itemId);
    console.log(this.selectedItems);
    if (index !== -1) {
      // Update the note property of the corresponding item
      this.selectedItems[index].note = event.target.value;


    }
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


    this.studentservice.addstage(this.myForm2.value)
      .subscribe({
        next: (res) => {
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


        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });
  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  selectedType: string = '';
  searchTerm: any = ""
  filteredItems: any
  show_filter_classe: any
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.res;


    } else {
      this.show_filter_classe = true
      // Apply filter based on search term
      this.filteredItems = this.res.filter((item: any) =>
        item.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  searchTerm2: any
  applyFilter2() {
    // Check if search term is empty
    if (this.searchTerm2.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.res;


    } else {
      this.show_filter_classe = true
      // Apply filter based on search term
      this.filteredItems = this.res.filter((item: any) =>
        item.classe.toLowerCase().includes(this.searchTerm2.toLowerCase())
      );
    }
  }
  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredItems.length);


    return this.filteredItems.slice(startIndex, endIndex);



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
  stage_by_id: any
  stage_id: any
  click(stage_id: any) {
    this.stage_id = stage_id
    this.showPopup = true
  }
  notestage() {
    this.studentservice.note_satge(this.stage_id, this.myForm2.value).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.stage_by_id = res
        this.showPopup = false

      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
  }
  allnotestage() {
    for (let stage of this.selectedItems) {
      this.studentservice.note_satge(stage._id, { "note": stage.note }).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.stage_by_id = res


        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });
    }
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

    }
  }
}
