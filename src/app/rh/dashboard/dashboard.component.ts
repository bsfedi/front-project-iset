import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

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
  ApexFill,
  ApexResponsive
} from "ng-apexcharts";

import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';



export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  responsive: ApexResponsive[] | any
  yaxis: ApexYAxis | any;
  labels: any | any;
  colors: string[] | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
};
export type ChartOptions1 = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  responsive: ApexResponsive[] | any
  yaxis: ApexYAxis | any;
  labels: any | any;
  colors: string[] | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean = false;
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  cardstats: any
  stats: any
  searchTerm: any
  sortDirection: 'asc' | 'desc' = 'asc'; // Initial sorting direction
  sortDirectionAlpha: 'A-Z' | 'Z-A' = 'A-Z'
  sortType: 'date' | 'alpha' = 'date'; // Initial sorting type
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  filteredItems: any[] = [];
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart1") chart1: ChartComponent | any;
  public chartOptions1: Partial<ChartOptions1>;
  res: any
  showfilterbar: any;
  currentDate: Date = new Date();
  myForm2: FormGroup;
  constructor(private studentservice: StudentService, private datePipe: DatePipe, private fb: FormBuilder, private router: Router) {

    this.myForm2 = this.fb.group({
      titre: [''],
      departement: [''],
      contenu: [''],
      ens: ['']

    });




    this.chartOptions = {}
    this.chartOptions1 = {}

  }

  formattedDateTime(): any {
    return this.datePipe.transform(this.currentDate, 'dd/MM/yyyy HH:mm');
  }
  gotocdashboad() {

    this.router.navigate([clientName + '/allStudents'])

  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
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
  gotovalidemission(id_mission: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + id_mission])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ens_id: any
  role: any
  all_demandes: any
  all_demandes1: any
  all_demande_presence_validated: any
  all_demande_presence_pending: any
  all_demande_presence: any
  all_demande_verification_validated: any
  all_demande_verification_pending: any
  all_demande_verification: any
  statsres: any
  show: any
  fullname: any
  attestations: any
  annonces: any
  annonces_ens: any
  departement: any
  accept(demande_id: any) {
    const data = {
      "role": this.role,
      "validated": true

    }
    this.studentservice.update_new_status_demande(demande_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande modifée  avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
    });

  }
  deleteannonce(annonce_id: any) {

    this.studentservice.deleteannonce(annonce_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> Annonce supprimée  avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
    });

  }
  ngOnInit(): void {
    this.studentservice.getpendingregister().subscribe({
      next: (res) => {
        this.items = res

        this.filteredItems = this.items


      }, error(e) {
        console.log(e);

      }
    });

    this.studentservice.attestations().subscribe({
      next: (res) => {
        this.attestations = res




      }, error(e) {
        console.log(e);

      }
    });


    this.ens_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
          this.departement = res.preregister.personalInfo.departement
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
          this.departement = res.departement
          this.studentservice.annonces(this.departement).subscribe({
            next: (res) => {
              console.log(this.departement);

              this.annonces = res
            }, error(e) {
              console.log(e);

            }
          });



        }, error(e) {
          console.log(e);

        }
      });
    }

    if (this.role == "enseignant") {
      this.studentservice.stats_enseignant(this.ens_id).subscribe({
        next: (res) => {
          this.show = true
          this.all_demande_presence_validated = res.all_demande_presence_validated
          this.all_demande_presence_pending = res.all_demande_presence_pending
          this.all_demande_presence = res.all_demande_presence
          this.all_demande_verification_validated = res.all_demande_verification_validated
          this.all_demande_verification_pending = res.all_demande_verification_pending
          this.all_demande_verification = res.all_demande_verification

        }, error(e) {
          console.log(e);

        }
      });
    } else if (this.role === "student") {
      this.studentservice.stats_student(this.ens_id).subscribe({
        next: (res) => {
          this.show = true
          this.statsres = res
          this.chartOptions = {
            series: [res.all_demande_presence || 0, res.all_demande_verification || 0],
            chart: {
              width: 420,
              type: "pie"
            },
            labels: ["Attestation de presence", "Demande de verification"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 580,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
          this.chartOptions1 = {
            series: [res.presence_status_percentages.pending || 0, res.presence_status_percentages.validated_by_departement || 0, res.presence_status_percentages.validated || 0, res.verification_status_percentages.pending || 0, res.verification_status_percentages.validated_by_enseignant || 0, res.verification_status_percentages.validated || 0],
            chart: {
              width: 420,
              height: 210,
              type: "pie"
            },
            labels: ["Attestaion En attente", " Attestaion En cours", "Attestaion Validée", "Vérification En attente", " Vérification En cours", "Vérification Validée"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
        }, error(e) {
          console.log(e);

        }
      });

    } else {
      this.studentservice.stats_tuitionofficer().subscribe({
        next: (res) => {
          this.show = true;
          this.statsres = res;
          this.chartOptions = {
            series: [res.demande_count || 0, res.preregistres_count || 0, res.rattrapage_count || 0, res.enseignant_demande || 0],
            chart: {
              width: 420,
              type: "pie"
            },
            labels: ["Attestation de presence", "Inscription", "Demande de rattrapge", "Enseignant demande"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 580,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
          this.chartOptions1 = {
            series: [res.pending_preregistres_count + res.pending_demande_count || 0, res.total_count - (res.validated_preregistres_count +
              res.validated_demande_count + res.pending_preregistres_count + res.pending_demande_count) || 0, res.validated_preregistres_count + res.validated_demande_count],
            chart: {
              width: 420,
              height: 210,
              type: "pie"
            },
            labels: ["En attente", "Non validée", " Validée"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
        },
        error: (e) => {
          this.show = true;

          this.chartOptions = {
            series: [0, 0, 0, 0],
            chart: {
              width: 420,
              type: "pie"
            },
            labels: ["Attestation de presence", "Inscription", "Demande de rattrapge", "Enseignant demande"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 580,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
          this.chartOptions1 = {
            series: [0, 0, 0, 0],
            chart: {
              width: 420,
              height: 210,
              type: "pie"
            },
            labels: ["En attente", "Non validée", " Validée"],
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"], // Specify colors for each label
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 250
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
        }
      });

    }





    this.studentservice.getverification_by_enseignant(this.ens_id).subscribe({
      next: (res) => {
        this.all_demandes1 = res
        console.log(this.all_demandes);


      }, error(e) {
        console.log(e);

      }
    });

  }

  getdemandes() {

  }
  add_annonce() {

    this.myForm2.value.departement = this.departement
    if (this.role == 'admin' || this.role == 'directeuretudes') {
      this.myForm2.value.ens = "all"
    }
    this.studentservice.add_annonce(this.myForm2.value)
      .subscribe({
        next: (res) => {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> Annonce ajoutée avec succès! </div> 
                
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
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/students/' + _id])
  }
  resetFilter() {
    this.selectedItem = 'reset';
    this.searchTerm = ''; // Reset the search term
    this.sortDirection = 'asc'; // Reset sorting direction for date
    this.sortType = 'date'; // Reset sorting type to date
    this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
    this.sortItems(); // Apply default sorting
    this.getdemandes()
  }
  openPopup(): void {
    this.showPopup = true;
  }
  showfilter() {
    this.showfilterbar = true
  }
  openPopup1(id: any): void {

    this.showPopup1 = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);

  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }

  }
  validateJobCotractEdition(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    console.log(data);

  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.items;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.items.filter((item: any) =>
        item.personalInfo.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.personalInfo.departement.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.personalInfo.last_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  toggleSortDirection(type: any) {
    this.selectedItem = type;
    if (this.sortType !== type) {
      this.sortType = type;
      this.sortDirection = 'asc'; // Reset sorting direction if changing sorting type
      if (type === 'alpha') {
        this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
      }
    } else {
      if (type === 'date') {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Toggle sorting direction for date
      } else if (type === 'alpha') {
        this.sortDirectionAlpha = this.sortDirectionAlpha === 'A-Z' ? 'Z-A' : 'A-Z'; // Toggle sorting direction for alpha
      }
    }
    this.sortItems(); // Call the sorting function
  }

  sortItems() {
    if (this.sortType === 'date') {
      this.sortItemsByDate();
    } else if (this.sortType === 'alpha') {
      this.sortItemsByAlpha();
    }
  }

  sortItemsByDate() {
    this.items.sort((a: any, b: any) => {
      const timeDiff = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
      return this.sortDirection === 'asc' ? timeDiff : -timeDiff; // Reverse sorting direction if 'desc'
    });
  }
  selectedItem: string | null = null;
  sortItemsByAlpha() {
    this.items.sort((a: any, b: any) => {
      const nameA = a.personalInfo.firstName.value.toUpperCase(); // Convert to uppercase for case-insensitive comparison
      const nameB = b.personalInfo.firstName.value.toUpperCase();
      if (this.sortDirectionAlpha === 'A-Z') { // Check the sorting direction for alphabetical order
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      } else { // If sorting direction is Z-A
        if (nameA < nameB) {
          return 1; // Reverse the comparison
        }
        if (nameA > nameB) {
          return -1; // Reverse the comparison
        }
        return 0;
      }
    });
  }
  exportTable() {
    // Select the table element
    const table = document.querySelector('table');

    // Check if table is not null
    if (table) {
      // Get the table rows
      const rows = Array.from(table.querySelectorAll('tr'));

      // Create an array to store the row data
      const rowData = [];

      // Get the header row
      const headerRow = rows[0];

      // Get the cells within the header row
      const headerCells = Array.from(headerRow.querySelectorAll('th'));

      // Get the header cell content and add it to the rowData array
      const headerRowDataItem = headerCells.map(cell => cell.innerText.trim());
      rowData.push(headerRowDataItem.join(','));

      // Iterate over each row (starting from the second row to exclude the header)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowDataItem: any[] = [];

        // Get the cells within the row
        const cells = Array.from(row.querySelectorAll('td'));

        // Iterate over each cell
        cells.forEach(cell => {
          // Add cell content to rowDataItem array
          rowDataItem.push(cell.innerText.trim());
        });

        // Add rowDataItem array to rowData array
        rowData.push(rowDataItem.join(','));
      }

      // Convert rowData array to CSV string
      const csvString = rowData.join('\n');

      // Create a Blob object containing the CSV data
      const blob = new Blob([csvString], { type: 'text/csv' });

      // Create a temporary anchor element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none;');
      a.href = url;
      a.download = 'table_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // Handle the case when the table is not found
      console.error('Table element not found');
    }
  }
  validateContractValidation(id: any, contractValidation: any): void {
    const data = {
      "validated": contractValidation
    }
    console.log(data);

    // this.inscriptionservice.validateContractValidation(id, data, this.headers).subscribe({
    //   next: (res) => {
    //     // Handle the response from the server
    //   },
    //   error: (e) => {
    //     // Handle errors
    //     console.error(e);
    //     // Set loading to false in case of an error

    //   }
    // });
  }

  gottoallStudents() {
    this.router.navigate([clientName + '/allStudents'])
  }


}
