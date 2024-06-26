import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
declare let html2pdf: any
import { DatePipe } from '@angular/common';
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
  selector: 'app-all-consultants',
  templateUrl: './all-consultants.component.html',
  styleUrls: ['./all-consultants.component.css']
})
export class allStudentsComponent {
  selectedItem: string | null = null;
  items: any[] = [];
  items1: any[] = [];
  sortDirection: 'asc' | 'desc' = 'asc'; // Initial sorting direction
  sortDirectionAlpha: 'A-Z' | 'Z-A' = 'A-Z'
  sortType: 'date' | 'alpha' = 'date'; // Initial sorting type
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
  stats: any
  cardstats: any
  show: any
  process_statut: any
  @ViewChild("chart") chart: ChartComponent | any;
  searchTerm: any
  searchTerm1: any
  shownotiff: boolean = false
  filteredItems: any[] = [];
  filteredItems1: any[] = [];
  res: any
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  constructor(private studentservice: StudentService, private datePipe: DatePipe, private fb: FormBuilder, private router: Router) {




  }
  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 10; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  pageSize1 = 10; // Number of items per page
  currentPage1 = 1; // Current page
  totalPages1: any;
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
  nextPage1() {
    if (this.currentPage1 < this.totalPages1) {
      this.currentPage1++;
    }
  }

  previousPage1() {
    if (this.currentPage1 > 1) {
      this.currentPage1--;
    }
  }
  role: any
  fullname: any
  departement: any
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
        }, error(e) {
          console.log(e);

        }
      });
    }
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
    this.new_notif = localStorage.getItem('new_notif');




    // Check if token is available
    if (token) {

      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.getpreregister()


    }

  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  getpreregister() {
    this.studentservice.validated_preregister().subscribe({
      next: (res) => {
        // Handle the response from the server
        this.nbdemande = res.length; // Assuming res is an array

        // Update this.items with the response
        this.items = res;
        this.filteredItems = this.items
        console.log(this.filteredItems);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error
      }
    });
  }
  resetFilter() {
    this.selectedItem = 'reset';
    this.searchTerm = ''; // Reset the search term
    this.sortDirection = 'asc'; // Reset sorting direction for date
    this.sortType = 'date'; // Reset sorting type to date
    this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
    this.sortItems(); // Apply default sorting
    this.getpreregister()

  }
  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
  }
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.items;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.items.filter((item: any) =>
        item.personalInfo.departement.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.personalInfo.classe.toLowerCase().includes(this.searchTerm.toLowerCase())

      );
    }
  }
  applyFilter1() {
    // Check if search term is empty
    if (this.searchTerm1.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems1 = this.items1;
    } else {
      // Apply filter based on search term
      this.filteredItems1 = this.items1.filter((item: any) =>
        item.personalInfo.firstName.value.toLowerCase().includes(this.searchTerm1.toLowerCase()) ||
        item.personalInfo.lastName.value.toLowerCase().includes(this.searchTerm1.toLowerCase())
      );
    }
  }

  generatePdf() {
    // Get the data for the table
    const displayedDocs = this.filteredItems;

    // Generate the table rows dynamically
    const tableRows = displayedDocs.map(item => `
        <tr>
            <td>${item.personalInfo.first_name} ${item.personalInfo.last_name}</td>
            <td><b>${item.personalInfo.code}</b></td>
            <td>${item.personalInfo.departement}</td>
            <td>
            ${item.personalInfo.classe}
               
            </td>
        </tr>
    `).join('');

    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 90%;
                margin-top: 30px;
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
          <div  style='text-align:center;display:flex'> 
          <img src="/assets/logoisetnabeul.jpg" style="width:20%;hiegth:20%">
          <div style="margin-top:30px">
          Ministère de l’Enseignement Supérieur et de la Recherche Scientifique <br> 
          Direction Générale des Etudes Technologiques <br> 
          Institut Supérieur des Etudes Technologiques de Nabeul
          </div> </div> <br>

          <b style='text-align:center;'> Liste des étudiants  </b>

            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Etudiant</th>
                    <th>code</th>
                    <th>Departement</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">classe</th>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
          </body> <br><br>
        </html>`;

    // Generate PDF from HTML content
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'etudiants.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
  }



  toggleSortDirection(type: any) {
    this.selectedItem = type;

    // If it's a new sorting type, reset the direction to ascending
    if (this.sortType !== type) {
      this.sortType = type;
      this.sortDirection = 'asc';
      // Reset sorting direction for alphabetical order
      if (type === 'alpha') {
        this.sortDirectionAlpha = 'A-Z';
      }
    } else { // If it's the same sorting type, toggle the direction
      if (type === 'date') {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else if (type === 'alpha') {
        // Toggle sorting direction for alphabetical order
        this.sortDirectionAlpha = this.sortDirectionAlpha === 'A-Z' ? 'Z-A' : 'A-Z';
      }
    }

    // Call the sorting function
    this.sortItems();
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
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/students/' + _id])
  }

  gotocdashboad() {

    this.router.navigate([clientName + '/dashboard'])

  }
  openPopup(): void {
    this.showPopup = true;
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
  validateContractValidation(id: any, contractValidation: any): void {
    const data = {
      "validated": contractValidation
    }
    console.log(data);
  }
  gotovalidemission(id_mission: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + id_mission])
  }
  gottoallStudents() {
    this.router.navigate([clientName + '/dashboard'])
  }
}
