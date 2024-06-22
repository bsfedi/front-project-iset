import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  show: any
  selectedOption: any
  selectedOption1: string = '';
  myForm4: FormGroup;
  constructor(private studentservice: StudentService, private router: Router, private fb: FormBuilder) {

    this.myForm4 = this.fb.group({
      departement: ['', Validators.required],
      phone: ['', Validators.required],
    })
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

  role: any
  fullname: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }
    const user_id = localStorage.getItem('user_id');

    this.studentservice.getallusers().subscribe({
      next: (res) => {
        this.all_rh = res
        this.show = true

      }, error(e) {
        console.log(e);

      }
    });
    this.studentservice.getallusers().subscribe({
      next: (res) => {
        this.all_users = res.users
        this.filteredItems = this.all_users
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

  show_message: any
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
        this.show_message = true
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

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> data uploaded avec succès! </div> 
                
              </div>
            `,


            confirmButtonText: 'Ok',
            confirmButtonColor: "rgb(0, 17, 255)",

            customClass: {
              confirmButton: 'custom-confirm-button-class',
              cancelButton: 'custom-cancel-button-class'
            },
            reverseButtons: true // Reversing button order
          })
        }
        if (res.error) {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> ckeck the file please the header should be like this
              ["nom", "prenom", "code_enseignement", "email", "numtel", "identifiantunique","departement", "role" ,"grade"]! </div> 
                
              </div>
            `,


            confirmButtonText: 'Ok',
            confirmButtonColor: "rgb(0, 17, 255)",

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
    Swal.fire({
      title: "Confirmez l'action",
      background: 'white',
      html: `
        <div>
        <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir supprimer ce compte ?  </div> 
          
        </div>
      `,
      iconColor: '#1E1E1E',
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
        // User clicked 'Yes', call the endpoint
        this.studentservice.deleteuser(user_id).subscribe({
          next: (res) => {
            if (res) {
              Swal.fire({

                background: 'white',
                html: `
                  <div>
                  <div style="font-size:1.2rem"> utilisateur supprimé avec succès! </div> 
                    
                  </div>
                `,


                confirmButtonText: 'Ok',
                confirmButtonColor: "rgb(0, 17, 255)",

                customClass: {
                  confirmButton: 'custom-confirm-button-class',
                  cancelButton: 'custom-cancel-button-class'
                },
                reverseButtons: true // Reversing button order
              })
            }
            if (res.error) {
              Swal.fire({

                background: 'white',
                html: `
                  <div>
                  <div style="font-size:1.2rem"> Error
             </div> 
                    
                  </div>
                `,


                confirmButtonText: 'Ok',
                confirmButtonColor: "rgb(0, 17, 255)",

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

    });


  }

  attributrole() {

    this.studentservice.attribut_role(this.user_id, this.selectedOption3).subscribe({
      next: (res) => {

        if (res.message == 'privilege add sucessufly') {
          this.showPopup1 = false;
          if (this.selectedOption3 == 'nonprivilege') {
            Swal.fire({

              background: 'white',
              html: `
                  <div>
                  <div style="font-size:1.2rem">  Privilège supprimé avec succès! </div> 
                    
                  </div>
                `,


              confirmButtonText: 'Ok',
              confirmButtonColor: "rgb(0, 17, 255)",

              customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class'
              },
              reverseButtons: true // Reversing button order
            })
          }
          else {
            Swal.fire({

              background: 'white',
              html: `
                  <div>
                  <div style="font-size:1.2rem"> privilege ajouté avec succès! </div> 
                    
                  </div>
                `,


              confirmButtonText: 'Ok',
              confirmButtonColor: "rgb(0, 17, 255)",

              customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class'
              },
              reverseButtons: true // Reversing button order
            })
          }




        }
        if (res.message == 'can add this privilege to tow users') {
          this.showPopup1 = false;
          Swal.fire({

            background: 'white',
            html: `
                <div>
                <div style="font-size:1.2rem"> Vous ne
                pouvez pas assigner deux directeurs de département
           </div> 
                  
                </div>
              `,


            confirmButtonText: 'Ok',
            confirmButtonColor: "rgb(0, 17, 255)",

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


  gotocdashboad() {

    this.router.navigate([clientName + '/allStudents'])

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

    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredItems.length);


    return this.filteredItems.slice(startIndex, endIndex);



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
    this.router.navigate([clientName + '/students /' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }
  show_profil: any
  profil: any
  departement: any
  phone: any
  openPopup1(id: any, show_profil: any): void {
    this.user_id = id
    this.show_profil = show_profil
    if (this.show_profil) {
      this.studentservice.getuserbyid(this.user_id).subscribe({
        next: (res) => {
          this.profil = res
          this.departement = this.profil.departement
          this.phone = this.profil.phone
        }, error(e) {
          console.log(e);

        }
      });
    }

    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  filteredItems: any[] = [];
  searchTerm: any
  searchTerm1: any
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '' && this.searchTerm1.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.all_users;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.all_users.filter((item: any) =>
        item.departement.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  applyFilter1() {
    console.log(this.searchTerm1, this.searchTerm);

    // Check if search term is empty
    if (this.searchTerm.trim() === '' && this.searchTerm1.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.all_users;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.all_users.filter((item: any) =>
        item.first_name.toLowerCase().includes(this.searchTerm1.toLowerCase())
      );
    }
  }

  updateUserByAdmin(id: any, departement: any, phone: any) {

    const data = {
      "departement": departement,
      "phone": phone
    }
    this.studentservice.update_user(id, this.myForm4.value).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Compte desactivé avec succès!', 'success');
        this.showPopup = false;

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
