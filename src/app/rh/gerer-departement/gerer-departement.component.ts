import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
const clientName = `${environment.default}`;

@Component({
  selector: 'app-gerer-departement',
  templateUrl: './gerer-departement.component.html',
  styleUrls: ['./gerer-departement.component.css']
})
export class GererDepartementComponent {
  token: any
  headers: any
  user_id: any
  tjmrequests: any
  formData: { typeVirement: string; montant: string } = { typeVirement: '', montant: '' };
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  res: any
  shownotiff: boolean = false
  pending_parcourss: any
  tjm: boolean = true
  parcours: any
  rattrapge: any
  myForm1: FormGroup;
  myForm2: FormGroup;
  myForm3: FormGroup;
  constructor(private consultantservice: ConsultantService, private studentservice: StudentService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private userservice: UserService, private fb: FormBuilder,) {
    this.myForm1 = this.fb.group({
      libelle: [''],
      code: [''],

    });
    this.myForm2 = this.fb.group({
      niveau: [''],
      parcour: [''],
      code: [''],
    });
    this.myForm3 = this.fb.group({
      niveau: [''],
      parcours: [''],
      code: [''],
      intitule: [''],
      type: ['']


    });
  }



  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 0; // Number of items per page
  currentPageparcours = 1; // Current page
  currentPagetjm = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {
    this.pageSize = 8

    if (this.tjm) {

      this.totalPages = Math.ceil(this.pending_parcourss.length / this.pageSize);
      const startIndex = (this.currentPageparcours - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.pending_parcourss.length);

      return this.pending_parcourss.slice(startIndex, endIndex);
    }
    if (this.rattrapge) {

      this.totalPages = Math.ceil(this.rattrapge_requests.length / this.pageSize);
      const startIndex = (this.currentPageparcours - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.rattrapge_requests.length);

      return this.rattrapge_requests.slice(startIndex, endIndex);
    }
    else {
      this.totalPages = Math.ceil(this.tjmrequests.length / this.pageSize);
      const startIndex = (this.currentPagetjm - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.tjmrequests.length);
      return this.tjmrequests.slice(startIndex, endIndex);
    }

  }
  nextPage() {
    if (this.currentPageparcours < this.totalPages) {
      this.currentPageparcours++;
    }
  }

  previousPage() {
    if (this.currentPageparcours > 1) {
      this.currentPageparcours--;
    }
  }
  nextPagetjm() {
    if (this.currentPagetjm < this.totalPages) {
      this.currentPagetjm++;
    }
  }

  previousPageyjm() {
    if (this.currentPagetjm > 1) {
      this.currentPagetjm--;
    }
  }

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  ens: any
  affecterDemande(selectedId: string) {
    // Perform the desired action with the selected ID
    console.log(selectedId);
  }
  role: any
  rattrapge_requests: any

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

    const token = localStorage.getItem('token');
    this.user_id = localStorage.getItem('user_id')
    this.new_notif = localStorage.getItem('new_notif');
    this.role = localStorage.getItem('role');
    this.studentservice.get_classes().subscribe({


      next: (res) => {
        this.tjmrequests = res



      },
      error: (e) => {
        // Handle errors
        this.tjmrequests = []
        console.error(e);
        // Set loading to false in case of an error
      }
    });
    this.studentservice.get_modules().subscribe({


      next: (res) => {
        this.rattrapge_requests = res
      },
      error: (e) => {
        // Handle errors
        this.tjmrequests = []
        console.error(e);
        // Set loading to false in case of an error
      }
    });

    // Check if token is available
    if (token) {

      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getRhNotificationsnotseen().subscribe({
        next: (res1) => {
          this.nblastnotifications = res1.length
          this.lastnotifications = res1

        },
        error: (e) => {
          this.nblastnotifications = 0
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

    this.userservice.getpersonalinfobyid(this.user_id).subscribe({


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

    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);

    this.studentservice.get_parcours().subscribe(
      (response) => {
        this.pending_parcourss = response


        // Add any additional handling or notifications if needed
      },
      (error) => {
        this.pending_parcourss = []
        console.error('Error getting virement:', error);
        // Handle the error or display an error message
      }
    );
  }

  accept(demande_id: any) {
    const data = {
      "role": this.role,
      "validated": true

    }
    this.studentservice.update_status_demande_bychef(demande_id).subscribe({
      next: (res) => {

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

  accept_note(demande_id: any) {

    this.studentservice.accept_note(demande_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> verification de note validée  avec succès! </div> 
              
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
  parcour_by_id: any
  parcours_id: any
  tjm1: any
  get_parcour_by_id(parcours_id: any) {
    this.parcours_id = parcours_id
    this.tjm1 = true
    this.showPopup2 = true;
    this.studentservice.get_parcour_by_id(parcours_id).subscribe({
      next: (res) => {

        this.parcour_by_id = res
        this.myForm1.value.code = this.parcour_by_id.code

      }, error(e) {
        console.log(e);

      }
    });

  }

  classe_by_id: any
  classe_id: any
  parcours1: any

  get_classe_by_id(classe_id: any) {
    this.parcours_id = classe_id
    this.parcours1 = true
    this.showPopup2 = true;
    this.studentservice.get_classe_by_id(classe_id).subscribe({
      next: (res) => {

        this.classe_by_id = res


      }, error(e) {
        console.log(e);

      }
    });

  }

  module_by_id: any
  module_id: any
  rattrapge1: any

  get_module_by_id(classe_id: any) {
    this.module_id = classe_id
    this.rattrapge1 = true
    this.showPopup2 = true;
    this.studentservice.get_module_by_id(classe_id).subscribe({
      next: (res) => {

        this.module_by_id = res


      }, error(e) {
        console.log(e);

      }
    });

  }

  update_parcours() {

    this.studentservice.update_parcours(this.parcours_id, this.myForm1.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> Parccours modifiée  avec succès! </div> 
              
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
  update_classes() {

    this.studentservice.update_classes(this.classe_id, this.myForm2.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> Classe modifiée  avec succès! </div> 
              
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

  update_modules() {

    this.studentservice.update_modules(this.module_id, this.myForm3.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> Module modifiée  avec succès! </div> 
              
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


  showtjm() {
    this.tjm = true
    this.parcours = false
    this.rattrapge = false
  }
  showparcours() {
    this.tjm = false
    this.parcours = true
    this.rattrapge = false
  }
  Salle: string = ''
  horaire: string = ''
  update_rattrapage() {
    const data = {
      "status": "validated",
      "salle": this.Salle,
      "horaire": this.horaire
    }
    this.studentservice.update_rattrapage(this.rattrapage_id, data).subscribe({
      next: (res) => {

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

  deleteparcour(id: any) {

    this.studentservice.deleteparcour(id).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> parcour supprimée  avec succès! </div> 
              
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
  deleteclasse(id: any) {

    this.studentservice.deleteclasse(id).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> parcour supprimée  avec succès! </div> 
              
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
  deletemodule(id: any) {

    this.studentservice.deletemodule(id).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> parcour supprimée  avec succès! </div> 
              
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
  refuse_rattrapage() {
    const data = {
      "status": "invalidated",
      "motif": this.motif
    }
    this.studentservice.update_rattrapage(this.rattrapage_id, data).subscribe({
      next: (res) => {

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
  add_module() {

    this.studentservice.add_module(this.myForm3.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> module ajoutée  avec succès! </div> 
              
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
  add_parcours() {

    this.studentservice.add_parcours(this.myForm1.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> module ajoutée  avec succès! </div> 
              
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
  add_classe() {

    this.studentservice.add_classe(this.myForm2.value).subscribe({
      next: (res) => {

        Swal.fire({

          background: '#fefcf1',
          html: `
            <div>
            <div style="font-size:1.2rem"> classe ajoutée  avec succès! </div> 
              
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
  motif: string = '';
  showPopup1: any
  showPopup2: any
  rattrapage_id: any
  openPopup1(): void {

    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  openPopup2(rattrapage_id: any): void {
    this.rattrapage_id = rattrapage_id
    this.showPopup2 = true;
  }
  closePopup2(): void {
    this.showPopup2 = false;

  }
  showrattrapge() {
    this.tjm = false
    this.parcours = false
    this.rattrapge = true
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationparcours(_id: string) {
    this.router.navigate([clientName + '/parcours/' + _id])
  }
  gotovalideparcours(parcours_id: any, id: any) {
    this.router.navigate([clientName + '/validationparcours/' + parcours_id + '/' + id])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  affecter_damande1(demande_id: any, enseignant_id: any) {

    this.studentservice.affecter_damande(demande_id, enseignant_id).subscribe({


      next: (res) => {


        console.log(res);

      },
      error: (e) => {
        // Handle errors

        console.error(e);
        // Set loading to false in case of an error
      }
    });
  }
  onFormSubmit() {

    const formData = {
      // Extract form data as needed (e.g., fullName, companyName)
      // Example:


      userId: this.user_id,
      typeVirement: this.formData.typeVirement,
      montant: this.formData.montant,
      // Add other form data here
    };

    this.consultantservice.createvirement(formData).subscribe(
      (response) => {
        console.log('Virement created successfully:', response);
        // Add any additional handling or notifications if needed
      },
      (error) => {
        console.error('Error creating virement:', error);
        // Handle the error or display an error message
      }
    );
  }
}
