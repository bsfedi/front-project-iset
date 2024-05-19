import { Component } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { jsPDF } from "jspdf";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
const clientName = `${environment.default}`;
declare let html2pdf: any
@Component({
  selector: 'app-gestion-orientation',
  templateUrl: './gestion-orientation.component.html',
  styleUrls: ['./gestion-orientation.component.css']
})
export class GestionOrientationComponent {
  constructor(
    private studentservice: StudentService, private router: Router
  ) {

  }
  role: any
  fullname: any
  departement: any
  searchTerm: any
  pageSize = 10; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  pageSize1 = 5; // Number of items per page
  currentPage1 = 1; // Current page
  totalPages1: any;
  orientations: any
  filteredItems: any[] = [];
  all_orientations: any
  show: any
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.role = localStorage.getItem('role');
    this.departement = localStorage.getItem('depatement')
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
          this.studentservice.orientation_by_dep(res.departement).subscribe({
            next: (res) => {
              this.show = true
              this.orientations = res
            }, error(e) {
              console.log(e);

            }
          });
          this.fullname = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }

    this.studentservice.orientations().subscribe({
      next: (res) => {
        this.all_orientations = res
        this.filteredItems = this.all_orientations;
      }, error(e) {
        console.log(e);

      }
    })
  }
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.all_orientations;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.all_orientations.filter((item: any) =>
        item.departement.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  affcterstudent(event: any, student_id: any) {
    const selectedValue = event.target.value;
    this.studentservice.putorientation(student_id, selectedValue).subscribe({
      next: (res) => {

        window.location.reload()
      }
    })
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
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredItems.length);


    return this.filteredItems.slice(startIndex, endIndex);



  }
  generatePdf() {
    // Get the data for the table
    const displayedDocs = this.getDisplayeddocs();

    // Generate the table rows dynamically
    const tableRows = displayedDocs.map(item => `
        <tr>
            <td>${item.student}</td>
            <td><b>${item.choix1} - ${item.choix2} - ${item.choix3} - ${item.choix4}</b></td>
            <td>${item.departement}</td>
            <td>
            ${item.resultat}
               
            </td>
        </tr>
    `).join('');

    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
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

          <b style='text-align:center;'> Liste d'affectation des étudiants  </b>

            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Etudiant</th>
                    <th>choix</th>
                    <th>Departement</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">Affecter</th>
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
      filename: 'orientation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
  }

}
