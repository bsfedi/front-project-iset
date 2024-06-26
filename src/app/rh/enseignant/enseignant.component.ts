import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;
const clientName = `${environment.default}`;
@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.css']
})
export class EnseignantComponent {
  constructor(private studentservice: StudentService, private router: Router, private fb: FormBuilder) {
  }
  all_demandes: any = [];
  getverification_absence = []
  all_demandes1: any = [];
  fileInputs: any = {};
  cin_img: string | null = null;
  selectedFile: any | null = null;
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  currentPageconsultant = 1; // Current page
  totalPages: any;
  role: any
  show: any
  ens_id: any
  fullname: any
  alldem: any
  departement: any
  ngOnInit(): void {

    this.ens_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }

    else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
          this.departement = res.departement
          if (this.role == 'directeuretudes' || res.privilege == 'directeuretudes' || res.role == 'admin') {
            this.studentservice.verification_absences().subscribe({
              next: (res) => {
                this.getverification_absence = res;


              },
              error: (e) => {
                // Handle errors
                this.getverification_absence = [];
                console.error(e);

                // Set loading to false in case of an error
              },
            });
          } else {
            this.studentservice.verification_absences_departement(this.departement).subscribe({
              next: (res) => {
                this.getverification_absence = res;


              },
              error: (e) => {
                // Handle errors
                this.getverification_absence = [];
                console.error(e);

                // Set loading to false in case of an error
              },
            });

          }
        }, error(e) {
          console.log(e);

        }
      });
    }

    this.studentservice.getdemadndesenseignant(this.ens_id).subscribe({
      next: (res: any) => {

        this.alldem = res;
        for (let item of res) {

          if (item['status'] != 'prete' && item['status'] != 'validated_by_departement') {
            console.log(item);

            this.all_demandes.push(item)
            console.log(this.all_demandes);

          }




        }
        this.show = true


      },
      error: (e: any) => { // corrected error function syntax
        this.all_demandes = [];
      }
    });


    this.studentservice.getverification_by_enseignant(this.ens_id).subscribe({
      next: (res) => {

        for (let item of res) {

          if (item['status'] != 'validated') {


            this.all_demandes1.push(item)


          }




        }
        this.show = true


      }, error(e) {



      }
    });

  }
  getDisplayegetverification_absence(): any[] {


    this.totalPages = Math.ceil(this.getverification_absence.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.getverification_absence.length);


    return this.getverification_absence.slice(startIndex, endIndex);



  }
  showerror: any
  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'cin') {

          this.cin_img = e.target!.result as string;
          this.showerror = false
        } else {
          this.showerror = true
        }

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  new_note: any
  newNote: string = '';
  error_message: any
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  justif() {
    const formData = new FormData();


    if (this.cin_img === null) {
      this.error_message = "la pièce jointe est obligatoire"
    }
    else {
      const cin = this.fileInputs.cin.files[0];
      formData.append('justif', cin);
    }


    const data = {
      "justif": formData,


    }

    this.studentservice.justif(formData, this.newNote, this.demande_id).subscribe({
      next: (res: any) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande acceptée avec succès! </div> 
              
            </div>
          `,


          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",

          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page
            location.reload();
          }
        });

      }, error(e) {
        console.log(e);

      }
    });
  }


  validated() {
    const data = {
      "role": this.role,
      "validated": true

    }
    this.studentservice.update_status_demande(data, this.demande_id, this.ens_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande accepté avec succès! </div> 
              
            </div>
          `,


          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",

          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page
            location.reload();
          }
        });

      }, error(e) {
        console.log(e);

      }
    });

  }

  update_verification_absence(item_id: any, status: any, new_absence: any) {
    if (new_absence == 'e') {
      this.studentservice.update_verification_absence(item_id, status, new_absence).subscribe({
        next: (res) => {

          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande accepté avec succès! </div> 
                
              </div>
            `,


            confirmButtonText: 'Ok',
            confirmButtonColor: "rgb(0, 17, 255)",

            customClass: {
              confirmButton: 'custom-confirm-button-class',
              cancelButton: 'custom-cancel-button-class'
            },
            reverseButtons: true // Reversing button order
          }).then((result) => {
            if (result.isConfirmed) {
              // Reload the page
              location.reload();
            }
          });

        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.update_verification_absence(item_id, status, this.newNote).subscribe({
        next: (res) => {

          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> demande accepté avec succès! </div> 
                
              </div>
            `,


            confirmButtonText: 'Ok',
            confirmButtonColor: "rgb(0, 17, 255)",

            customClass: {
              confirmButton: 'custom-confirm-button-class',
              cancelButton: 'custom-cancel-button-class'
            },
            reverseButtons: true // Reversing button order
          }).then((result) => {
            if (result.isConfirmed) {
              // Reload the page
              location.reload();
            }
          });

        }, error(e) {
          console.log(e);

        }
      });
    }


  }
  refus() {
    const data = {
      "role": this.role,
      "validated": false

    }
    this.studentservice.update_status_demande(data, this.demande_id, this.ens_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande refusée  avec succès! </div> 
              
            </div>
          `,


          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",

          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page
            location.reload();
          }
        });

      }, error(e) {
        console.log(e);

      }
    });

  }
  getDisplayedconsultants(): any[] {
    console.log(this.all_demandes.length);

    this.totalPages = Math.ceil(this.all_demandes.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_demandes.length);

    return this.all_demandes.slice(startIndex, endIndex);
  }
  refuserverification(demande_id: any) {
    this.studentservice.notvalidate_verification(demande_id).subscribe({
      next: (res) => {
        Swal.fire({
          background: 'white',
          html: `
            <div>
              <div style="font-size:1.2rem">Demande refusée avec succès!</div>
            </div>
          `,
          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",
          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class'
          },
          reverseButtons: true // Reversing button order
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page
            location.reload();
          }
        });
      },
      error(e) {
        console.log(e);
      }
    });
  }

  showPopup: any
  openPopup(demande_id: any): void {
    this.demande_id = demande_id
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }
  showPopup2: any
  openPopup2(demande_id: any): void {
    this.demande_id = demande_id
    this.showPopup2 = true;
  }
  closePopup2() {
    this.showPopup = false;
  }

  totalPages1: any
  pageSize1 = 5
  getDisplayedconsultants1(): any[] {

    this.totalPages1 = Math.ceil(this.all_demandes1.length / this.pageSize1);
    const startIndex = (this.currentPageconsultant - 1) * this.pageSize1;
    const endIndex = Math.min(startIndex + this.pageSize1, this.all_demandes1.length);

    return this.all_demandes1.slice(startIndex, endIndex);
  }


  nextPage1() {
    if (this.currentPageconsultant < this.totalPages1) {
      this.currentPageconsultant++;
    }
  }

  previousPage1() {
    if (this.currentPageconsultant > 1) {
      this.currentPageconsultant--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages1) {
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
