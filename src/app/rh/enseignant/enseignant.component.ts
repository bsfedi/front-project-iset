import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.css']
})
export class EnseignantComponent {
  constructor(private studentservice: StudentService, private router: Router, private fb: FormBuilder) {
  }
  all_demandes: any
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  currentPageconsultant = 1; // Current page
  totalPages: any;
  role: any
  ens_id: any
  ngOnInit(): void {
    this.ens_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    this.studentservice.getdemadndesenseignant(this.ens_id).subscribe({
      next: (res) => {
        this.all_demandes = res
        console.log(this.all_demandes);


      }, error(e) {
        console.log(e);

      }
    });

  }
  validated() {
    const data = {
      "role": "string",
      "validated": true

    }
    this.studentservice.update_status_demande(data, this.demande_id, this.ens_id).subscribe({
      next: (res) => {
        this.all_demandes = res
        console.log(this.all_demandes);
        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande accepté avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
    });

  }
  refus() {
    const data = {
      "role": "string",
      "validated": false

    }
    this.studentservice.update_status_demande(data, this.demande_id, this.ens_id).subscribe({
      next: (res) => {
        this.all_demandes = res
        console.log(this.all_demandes);
        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande refusé  avec succès! </div> 
              
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

      }, error(e) {
        console.log(e);

      }
    });

  }
  getDisplayedconsultants(): any[] {

    this.totalPages = Math.ceil(this.all_demandes.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_demandes.length);

    return this.all_demandes.slice(startIndex, endIndex);
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
  user_info: any
  showPopup1: any
  personalInfo: any
  docs: any
  demande_id: any
  openPopup1(user_id: any, demande_id: any): void {
    this.demande_id = demande_id

    this.studentservice.getpreregisterbyid(user_id).subscribe({
      next: (res) => {
        console.log(res);


        this.personalInfo = res.personalInfo;

        this.docs = res.docs
        this.docs.img_profil = baseUrl + "uploads/" + this.docs.img_profil
        this.docs.cin = baseUrl + "uploads/" + this.docs.cin
        this.docs.transcripts = baseUrl + "uploads/" + this.docs.transcripts


      }, error(e) {
        console.log(e);

      }
    });



    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }

}
