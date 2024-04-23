import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  all_rh: any
  showPopup: any
  myForm: FormGroup;
  all_users: any
  selectedOption3: any
  user_id: any
  showPopup1: any
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = [];
  res: any
  form1: boolean = false;
  form2: boolean = false;
  selectedOption: any
  selectedOption1: string = '';
  constructor(private inscriptionservice: InscriptionService, private studentservice: StudentService, private consultantservice: ConsultantService, private router: Router, private userservice: UserService, private socketService: WebSocketService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      code: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      departement: ['', Validators.required],
      grade: ['', Validators.required],
      identifiant: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      service: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.userservice.getpersonalinfobyid(user_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log('inffffffffoooooo', this.res);
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.studentservice.getallusers().subscribe({
      next: (res) => {
        this.all_rh = res

      }, error(e) {
        console.log(e);

      }
    });
    this.studentservice.getallusers().subscribe({
      next: (res) => {
        this.all_users = res.users
        console.log(this.all_users);


      }, error(e) {
        console.log(e);

      }
    });

  }
  fileInputs: any = {};

  fileName: string = '';
  selectedFile: any | null = null;
  users_data: any
  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'cin') {

          this.users_data = e.target!.result as string;

        }

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  updateForms() {
    if (this.selectedOption === 'manu') {
      this.form1 = true;
      this.form2 = false;
    } else if (this.selectedOption === 'import') {
      this.form1 = false;
      this.form2 = true;
    }
  }


  pageSizenv = 5; // Number of items per page
  currentPagenv = 1; // Current page

  totalPagesnv: any = 1;
  nextPagenv() {
    if (this.currentPagenv < this.totalPagesnv) {
      this.totalPagesnv++;
    }
  }

  previousPagenv() {
    if (this.currentPagenv > 1) {
      this.currentPagenv--;
    }
  }
  add_user() {
    console.log(this.myForm.value);
    // You can do further processing here, such as sending the form data to an API
  }
  addnewuser() {
    this.studentservice.newuser(this.myForm.value).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Utilisateur ajouté avec succès!', 'success');
        this.showPopup = false;
        // Handle the response from the server
        console.log(res);
        window.location.reload();
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }

  attribut_role() {
    this.studentservice.newuser(this.myForm.value).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Utilisateur ajouté avec succès!', 'success');
        this.showPopup = false;
        // Handle the response from the server
        console.log(res);
        window.location.reload();
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }
  upload_users(selectedOption1: any) {
    const cin = this.fileInputs.cin.files[0];
    const formData = new FormData();
    formData.append('file', cin)
    this.studentservice.upload_users(formData, selectedOption1).subscribe({
      next: (res) => {
        if (res) {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> data uploaded avec succès! </div> 
                
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
        }
        if (res.error) {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> ckeck the file please the header should be like this
              ["nom", "prenom", "code_enseignement", "email", "numtel", "identifiantunique","departement", "role" ,"grade"]! </div> 
                
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
        }

        this.showPopup = false;
        // Handle the response from the server
        console.log(res);
        // window.location.reload();
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }
  deletenewuser(user_id: any) {
    this.studentservice.deleteuser(user_id).subscribe({
      next: (res) => {
        if (res) {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> utilisateur supprimé avec succès! </div> 
                
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
        }
        if (res.error) {
          Swal.fire({

            background: '#fefcf1',
            html: `
              <div>
              <div style="font-size:1.2rem"> Error
         </div> 
                
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
        }

        this.showPopup = false;
        // Handle the response from the server
        console.log(res);
        window.location.reload();
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });

  }

  attributrole() {

    this.studentservice.attribut_role(this.user_id, this.selectedOption3).subscribe({
      next: (res) => {
        if (res.message == 'privilege add sucessufly') {
          Swal.fire({

            background: '#fefcf1',
            html: `
                <div>
                <div style="font-size:1.2rem"> privilege ajouté avec succès! </div> 
                  
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
        }
        if (res.message == 'can add this privilege to tow users') {
          Swal.fire({

            background: '#fefcf1',
            html: `
                <div>
                <div style="font-size:1.2rem"> can add this privilege to tow users
           </div> 
                  
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
        }

        this.showPopup = false;
        // Handle the response from the server
        console.log(res);
        // window.location.reload();
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });

  }


  gotocdashboad() {

    this.router.navigate([clientName + '/allConsultants'])

  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  currentPageconsultant = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.all_rh.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_rh.length);


    return this.all_rh.slice(startIndex, endIndex);



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

  getDisplayedconsultants(): any[] {

    this.totalPages = Math.ceil(this.all_users.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_users.length);


    return this.all_users.slice(startIndex, endIndex);



  }

  nextPageconsultant() {
    if (this.currentPageconsultant < this.totalPages) {
      this.currentPageconsultant++;
    }
  }

  previousPageconsultant() {
    if (this.currentPageconsultant > 1) {
      this.currentPageconsultant--;
    }
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/missions/' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }

  openPopup1(id: any): void {
    this.user_id = id
    console.log(this.user_id);

    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }

  add_userrh() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.addrhuser(this.myForm.value, headers).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Utilisateur ajouté avec succès!', 'success');
          this.showPopup = false;
          // Handle the response from the server
          console.log(res);
          window.location.reload();
          // Additional logic if needed
        },
        error: (e) => {
          // Handle errors
          console.error(e);
        },
      });
    }
  }
  updateAccountVisibility(id: any, activated: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    console.log(id);

    const data: any = {
      "activated": activated
    }
    this.consultantservice.updateAccountVisibility(id, data, headers).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Compte desactivé avec succès!', 'success');
        this.showPopup = false;
        window.location.reload();
        // Handle the response from the server
        console.log(res);
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }
  updateUserByAdmin(id: any, activated: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    console.log(id);

    const data: any = {
      "activated": activated
    }
    this.consultantservice.updateUserByAdmin(id, data, headers).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Compte desactivé avec succès!', 'success');
        this.showPopup = false;
        window.location.reload();
        // Handle the response from the server
        console.log(res);
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }


}
