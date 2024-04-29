import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-details-stage',
  templateUrl: './details-stage.component.html',
  styleUrls: ['./details-stage.component.css']
})
export class DetailsStageComponent {
  myForm2: FormGroup;
  formData1: FormGroup
  satge_id: any
  stage_by_id: any
  showpdf: any
  urlSafe: any;
  constructor(private studentservice: StudentService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.formData1 = this.fb.group({
      commentaire: [''],

      // Add other form controls as needed
    });
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
      project: [''],
      departement: [''],
      email_entreprise: ['', Validators.required],
      encadrent_externe: [''],
      email_encadrent_externe: [''],
      tel_encadrent_externe: [''],
      encadrant_interne: [''],
    });
  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.satge_id = params['id'];
    });
    this.studentservice.get_stage_by_id(this.satge_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.stage_by_id = res
        console.log(this.stage_by_id.fonctionalie);

        if (this.stage_by_id.cahier_charge.endsWith('.pdf')) {
          res.cahier_charge = baseUrl + "uploads/" + res.cahier_charge
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.cahier_charge);
          this.showpdf = true

        } else {
          this.showpdf = false
          res.cahier_charge = baseUrl + "uploads/" + res.cahier_charge
        }



      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });

  }
  accpter_satge() {
    const data = {
      "status": true
    }
    this.studentservice.update_satge(this.satge_id, data).subscribe({
      next: (res) => {
        Swal.fire({
          background: '#fefcf1',

          text: 'La demande de stage validé avec sucess !',
          confirmButtonColor: "#91c593",

        });
      }
    })
  }
  refuser_stage() {
    const data = {
      "commantaire": this.formData1.value.commentaire,
      "status": false
    }
    this.studentservice.update_satge(this.satge_id, data).subscribe({
      next: (res) => {
        Swal.fire({
          background: '#fefcf1',

          text: 'La demande de stage a éte refusé !',
          confirmButtonColor: "#91c593",

        });
      }
    })
  }
  showPopup3: any
  showpopuprefuser() {
    this.showPopup3 = true;
  }
  closePopup3() {
    this.showPopup3 = false;
  }
  replaceSlashWithBreak(text: string): SafeHtml {
    const replacedText = text.replace(/\\/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
  exportFormData() {
    // Get the form element
    const form = document.querySelector('form');

    // Check if form is not null
    if (form) {
      // Create an array to store the form data
      const formData = [''];

      // Get all input elements within the form
      const inputs = Array.from(form.querySelectorAll('input'));

      // Iterate over each input
      inputs.forEach(input => {
        // Extract input name and value
        const name = input.getAttribute('formControlName');
        const value = input.value.trim();

        // Add name and value to formData array
        formData.push(`${name}: ${value}`);
      });

      // Convert formData array to CSV string
      const csvString = formData.join('\n');

      // Create a Blob object containing the CSV data
      const blob = new Blob([csvString], { type: 'text/csv' });

      // Create a temporary anchor element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none;');
      a.href = url;
      a.download = 'form_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // Handle the case when the form is not found
      console.error('Form element not found');
    }
  }

}

