import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: any;

  constructor(private userService: StudentService, private router: Router) { }

  forgetPassword() {
    const data = { email: this.email };
    this.userService.forgot_password(data).subscribe(
      response => {
        console.log('Password reset email sent successfully');
        Swal.fire({
          title: 'Confirmer les modifications',
          html: `
            <div>
            <div style="font-size:1.2rem;">  Un email de réinitialisation de mot de passe a été envoyé ! </div> 
            </div>
          `,
          iconColor: '#1E1E1E',
          background: 'white',
          confirmButtonText: 'OK',
          confirmButtonColor: "rgb(0, 17, 255)",
          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        }).then((result) => {
          if (result.isConfirmed) {


            this.router.navigate([clientName + '/sign-in'])
            // User clicked 'Yes', call the endpoint

          }
        });

      },
      error => {
        console.error('Error sending password reset email:', error);
        if (error.status === 500) { // Check for specific error status code
          Swal.fire('Error', 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation de mot de passe.', 'error');
        } else {
          // Handle other types of errors or network issues here
          // You can display a generic error message or implement additional error handling logic
          Swal.fire('Error', 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation de mot de passe.', 'error');
        }
      }
    );
  }
  gotosingin() {
    this.router.navigate([clientName + '/sign-in']);
  }
  gotosinguup() {
    this.router.navigate([clientName + '/sign-up']);
  }
}
