import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';


const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css']
})
export class EditProfilComponent {
  res: any
  headers: any
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: number = 0;
  location: string = '';
  nationality: string = '';
  user_id: any
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  role: any;
  ens_id: any
  fullname: any
  constructor(private studentservice: StudentService, private router: Router) {

  }
  ngOnInit(): void {
    this.ens_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
          this.firstName = res.preregister.personalInfo.first_name
          this.lastName = res.preregister.personalInfo.last_name
          this.email = res.preregister.personalInfo.email
          this.phoneNumber = res.preregister.personalInfo.phone
          this.location = res.preregister.personalInfo.adresse
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
          this.firstName = res.first_name
          this.lastName = res.last_name
          this.email = res.email
          this.phoneNumber = res.phone
          this.location = res.adresse
        }, error(e) {
          console.log(e);

        }
      });
    }

  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  updateUser(): void {
    Swal.fire({
      title: 'Confirmez Vos Informations',
      html: `
        <div>
          <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre <br> vos informations personnelles ?  </div> 
          <div style="color:#a8a3a3;margin-top:5px"">Veuillez vérifier que toutes les données <br> saisies sont correctes et à jour.</div>
        </div>
      `,

      background: 'white',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      confirmButtonColor: "rgb(0, 17, 255)",
      cancelButtonText: 'Annuler',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUserInfo = {
          first_name: this.firstName,
          last_name: this.lastName,
          phone: this.phoneNumber,
          adresse: this.location,

        };
        // User clicked 'Yes', call the endpoint
        this.studentservice.updateuser(this.ens_id, updatedUserInfo).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire({
              title: 'Succès',
              text: 'Profil mise à jour avec succès !',
              background: 'white',
              confirmButtonColor: "rgb(0, 17, 255)",
            }).then((result) => {
              if (result.isConfirmed) {



                // User clicked 'Yes', call the endpoint

              }
            });
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire({
              title: 'Erreur',
              text: "Aucune modification n'a été apportée.",
              background: 'white',
              confirmButtonColor: "rgb(0, 17, 255)",
            });
          }
        });
      } else {
        // User clicked 'Cancel' or closed the popup
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          background: 'white',
          confirmButtonColor: "rgb(0, 17, 255)",
        });
      }
    });
  }

  changePassword(): void {
    Swal.fire({
      title: 'Confirmez Vos Informations',
      html: `
        <div>
          <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre <br> vos informations personnelles ?  </div> 
          <div style="color:#a8a3a3;margin-top:5px"">Veuillez vérifier que toutes les données <br> saisies sont correctes et à jour.</div>
        </div>
      `,

      background: 'white',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      confirmButtonColor: "rgb(0, 17, 255)",
      cancelButtonText: 'Annuler',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.newPassword !== this.confirmPassword) {
          // Display an error message or handle the mismatch scenario
          console.error('Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas');
          Swal.fire({
            title: 'Erreur',
            text: "Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas",
            confirmButtonColor: "rgb(0, 17, 255)",
            background: 'white',
          });
        }
        else {
          const passwordData = {
            old_password: this.currentPassword,
            new_password: this.newPassword
          };

          // Call the service to update password
          this.studentservice.updatepassword(this.ens_id, passwordData).subscribe({
            next: (res) => {
              // Handle success
              Swal.fire({

                title: 'Succès',
                text: 'Mot de passe mise à jour avec succès !',
                background: 'white',
                confirmButtonColor: "rgb(0, 17, 255)",
              }).then((result) => {
                if (result.isConfirmed) {
                  // Reload the page
                  location.reload();
                }
              });
            },
            error: (e) => {
              // Handle errors
              console.error(e);
              Swal.fire({
                title: 'Erreur',
                text: "Aucune modification n'a été apportée " + e.error.error
                ,

                background: 'white',
                confirmButtonColor: "rgb(0, 17, 255)",
              });
            }
          });
        }

      } else {
        // User clicked 'Cancel' or closed the popup
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          icon: 'info',
          confirmButtonColor: "rgb(0, 17, 255)",
        });
      }
    });



  }
}
