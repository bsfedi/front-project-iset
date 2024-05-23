import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// auth.service.ts
import { jsPDF } from "jspdf";
declare let html2pdf: any
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-pending-preinscription',
  templateUrl: './pending-preinscription.component.html',
  styleUrls: ['./pending-preinscription.component.css']
})
export class PendingPreinscriptionComponent {

  res: any
  clientValidation: any
  contactClient: any
  contractValidation: any
  jobCotractEdition: any
  validation_rh: any
  register_id: any
  constructor(private userservice: UserService, private inscriptionService: StudentService, private fb: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.register_id = localStorage.getItem('register_id')


    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.inscriptionService.getinscrption(this.register_id).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.res = res.preregister

          this.res.docs.img_profil = baseUrl + "uploads/" + this.res.docs.img_profil
          console.log(this.res.docs.img_profil);


          if (this.res.status == 'VALIDATED') {
            this.router.navigate([clientName + '/student/requests']);
          }

          // this.inscriptionService.getContaractByPrerigister(this.res._id, headers).subscribe({
          //   next: (res1) => {


          //     console.log(res1);


          //     this.validation_rh = this.res.status
          //     this.clientValidation = res1.clientValidation
          //     this.contactClient = res1.contactClient
          //     this.contractValidation = res1.contractValidation
          //     this.jobCotractEdition = res1.jobCotractEdition
          //     if (this.validation_rh == 'VALIDATED' && this.clientValidation == 'VALIDATED' && this.contactClient == 'VALIDATED' && this.contractValidation == 'VALIDATED' && this.jobCotractEdition == 'VALIDATED') {
          //       this.router.navigate([clientName + '/student/requests']);
          //     }



          //   },
          //   error: (e) => {
          //     // Handle errors
          //     console.error(e);
          //     // Set loading to false in case of an error

          //   }
          // });
        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });



    }
  }
  generatePdf1() {

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
       
        <div style='text-align:center; display:flex'> 
        <img src="/assets/logoisetnabeul.jpg" style="width:20%;hiegth:20%">
        <div style="margin-top:30px">
        Ministère de l’Enseignement Supérieur et de la Recherche Scientifique <br> 
        Direction Générale des Etudes Technologiques <br> 
        Institut Supérieur des Etudes Technologiques de Nabeul
        </div> </div>
          <div style="margin:10px 10px 10px 230px;font-size : 2rem">  <b> Fiche d’inscription </b><br> 
   </div> 
   <div style="margin:10px 10px 10px 240px;">        ANNEE UNIVERSITAIRE : ${this.res.personalInfo.annee}    </div>
          <div style="display:flex;">
          <div>
            <b>  </b>
      
            <div style='width: 38.875rem;
                  height: 20.0625rem;
                flex-shrink: 0;
                padding: 15px;'
               > 
          
             <b> Informations Etudiant :     </b><br>  <br>
             - <b> Nom et Prénom :  </b> ${this.res.personalInfo.first_name}  ${this.res.personalInfo.last_name}  <br>  <br>
             - <b> Sexe :   </b> ${this.res.personalInfo.sexe}  <br>  <br>
             - <b> cin :  </b> ${this.res.personalInfo.cin}    <br>  <br>
             - <b> Télephone :   </b> ${this.res.personalInfo.phone} <br>  <br>
             -  <b>Date de naissance :   </b>${this.res.personalInfo.brith_date} <br> <br>
             - <b> Departement :   </b> ${this.res.personalInfo.departement} <br> <br>
             - <b> Classe :    </b>${this.res.personalInfo.classe} <br> <br>
             - <b> Adresse :    </b> ${this.res.personalInfo.adresse} <br> <br>
             - <b>Année universitaire :     </b> ${this.res.personalInfo.annee} <br> <br>
            </div> <br> 
            

            <div style='width: 38.875rem;
            height: 15.0625rem;
            flex-shrink: 0;
            padding: 15px;'
            >
            <b> Information familiale:  </b><br>  <br>

             <b> - Nom et Prénom Père : </b>  ${this.res.family_info.father_name}     <br>  <br>        <b>  - Numéro de téléphone père  :   </b>  ${this.res.family_info.father_phone}     <br>  <br>           <b>    - Profession Père:  </b>  ${this.res.family_info.father_job} <br>  <br>
             <b> - Nom et Prénom Mère : </b>  ${this.res.family_info.mother_name}      <br>  <br>      <b>  - Numéro de téléphone Mère :   </b>  ${this.res.family_info.mother_phone}     <br>  <br>         <b>  - Profession Mère:  </b>  ${this.res.family_info.mother_job} <br>  <br>
 
          </div>
          <div style='width: 38.875rem;
          height: 12.9625rem;
          flex-shrink: 0;
          padding: 15px;'
          >
          <b> Documents Joints : </b><br>  <br>
          
          <input type="checkbox" style="margin-right:30px"> Relevé du Baccalauréat   <br>  <br>   <input type="checkbox" style="margin-right:30px"> Relevé du Baccalauréat     <br>  <br>         <input type="checkbox" style="margin-right:30px"> Relevé du Baccalauréat <br>  <br>

          
          
          
          
          <b style="margin:20px 10px 0px 420px"> Signature de l'étudiant   </b> 
          
           
                    </div>
          </div>
        </body>
      </html>
    `;

    html2pdf(htmlContent, {
      margin: 10,
      filename: 'preinscription.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

    }).pdf.save('document.pdf'), this.router.navigate([clientName + '/student/requests']);






    const pdf = new jsPDF();
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;


    // Create your HTML content as a string




  }
  navigatetoinfomations() {
    this.router.navigate([clientName + '/informations/' + this.res._id])

  }
}
