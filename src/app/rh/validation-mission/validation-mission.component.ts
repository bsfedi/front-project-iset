import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-validation-mission',
  templateUrl: './validation-mission.component.html',
  styleUrls: ['./validation-mission.component.css']
})
export class ValidationMissionComponent {
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  depot: any
  payment: any
  type: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  contract_id: any
  mission_id: any
  noteValue: string = '';
  noteshow: any;
  stats: any;
  res: any
  demandeur: any
  user_id: any
  paymenttype: any
  constructor(private inscriptionservice: InscriptionService, private consultantservice: StudentService, private userservice: UserService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.contract_id = params['id'];
      this.mission_id = params['id_mission']
    });

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');



    this.userservice.getpersonalinfobyid(user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.res = res

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getinscrption(this.mission_id).subscribe({
        next: (res) => {
          console.log(res);

          this.getContaractByPrerigister = res

          this.payment = res.preregister.validation.payment
          this.depot = res.preregister.validation.depot
          this.paymenttype = res.preregister.validation.paymenttype

          this.contractValidation = res.contractValidation
          this.jobCotractEdition = res.jobCotractEdition
          // Handle the response from the server
          this.idcontractByPreregister = res._id

          if (this.payment == true) {
            this.payment = 'true'
          }
          else if (this.payment == false) {
            this.payment = 'false'
          }




          if (this.depot == true) {
            this.depot = 'true'
          }
          else if (this.depot == false) {
            this.depot = 'false'
          }
          if (this.paymenttype == 'total') {
            this.paymenttype = 'total'
          }
          else if (this.paymenttype == 'tranche') {
            this.paymenttype = 'tranche'
          }



          if (this.contractValidation == "VALIDATED") {
            this.contractValidation = 'true'
          }
          else if (this.contractValidation == 'PENDING') {
            this.contractValidation = 'false'
          }
          else {
            this.contractValidation = 'DESACTIVATED'
          }


          if (this.jobCotractEdition == "VALIDATED") {
            this.jobCotractEdition = 'true'
          }
          else if (this.jobCotractEdition == 'PENDING') {
            this.jobCotractEdition = 'false'
          }
          else {
            this.jobCotractEdition = 'DESACTIVATED'
          }









        },
        error: (e) => {

          console.error(e);


        }
      });

    }

  }
  shownote() {
    this.noteshow = !this.noteshow
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  killmission(message: any) {
    const data = {
      "note": message
    }
    Swal.fire({
      title: 'Confirmer les modifications',
      html: `
        <div>
        <div style="font-size:1.2rem;">  Êtes-vous sûr de vouloir <br> mettre à jour la mission ?  </div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      background: '#fefcf1',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        // this.consultantservice.killnewMission(this.mission_id, data, this.headers).subscribe({
        //   next: (res) => {
        //     console.log(res.text);


        //   },
        //   error: (e) => {
        //     // Handle errors
        //     if (e.error.text == 'Mission Killed Successfully') {
        //       // Handle success
        //       Swal.fire({
        //         background: '#fefcf1',
        //         title: 'Mission terminé',
        //         text: "La mission est terminé avec succès",
        //         confirmButtonText: 'OK',
        //         confirmButtonColor: "#91c593",

        //       });
        //       // this.router.navigate([clientName +'/dashboard'])
        //     }

        //     else {
        //       Swal.fire('Error', 'Tu peux pas terminer une mission validé', 'error');
        //     }

        //   }
        // });

        // User clicked 'Yes', call the endpoint

      } else {
        Swal.fire({
          title: 'Annulé',
          background: '#fefcf1',
          text: "Aucune modification n'a été apportée.",
          confirmButtonText: 'Ok',
          confirmButtonColor: "#91c593",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });


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
    this.router.navigate([clientName + '/missions/' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  openPopup1(id: any): void {



    this.showPopup1 = true;
  }

  validatePriseDeContact(id: any, payment: any): void {


    const data = {
      "validated": payment
    }
    console.log(data);

    this.consultantservice.update_paiemnt_status(data, id).subscribe({
      next: (res) => {
        console.log(res);
        window.location.reload();
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validatedepot(id: any, depot: any): void {
    const data = {
      "validated": depot
    }
    this.consultantservice.update_depot_status(data, id).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        window.location.reload();
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateJobCotractEdition(mission_id: any, type: any): void {
    const data = {
      "type": type
    }
    console.log(data);

    this.consultantservice.update_paymenttype_status(data, mission_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        window.location.reload();
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateContractValidation(id: any, contractValidation: any): void {
    console.log(contractValidation);

    if (contractValidation == 'true' || contractValidation == 'false') {
      const data = {
        "validated": contractValidation
      }
      console.log(data);

      // this.consultantservice.validateContractValidation(this.contract_id, data, this.headers).subscribe({
      //   next: (res) => {
      //     // Handle the response from the server
      //     console.log(res);

      //     this.router.navigate([clientName + '/dashboard']);
      //   },
      //   error: (e) => {
      //     // Handle errors
      //     console.error(e);
      //     // Set loading to false in case of an error

      //   }
      // });
    }

  }

}
