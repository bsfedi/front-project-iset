import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {
  newPassword: any
  user_id: any
  constructor(private userService: StudentService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id']; // Get user_id from route parameters
    });
  }
  updatePassword() {

    const data = { "password": this.newPassword };
    this.userService.updatePassword(this.user_id, data).subscribe(
      response => {
        console.log('Password updated successfully');
        Swal.fire({

          html: `
            <div>
            <div style="font-size:1.2rem;"> Mot de passe modifié avec succès ! </div> 
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
        console.error('Error updating password:', error);
        Swal.fire('Error', 'An error occurred while updating the password.', 'error');
      }
    );
  }
  gotosingin() {
    this.router.navigate([clientName + '/sign-up']);
  }
  gotosinguup() {
    this.router.navigate([clientName + '/sign-up']);
  }
}
