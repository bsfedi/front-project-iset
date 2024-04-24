import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-tjmrequests',
  templateUrl: './tjmrequests.component.html',
  styleUrls: ['./tjmrequests.component.css']
})
export class TjmrequestsComponent {
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
  pending_missions: any
  tjm: boolean = true
  mission: any
  rattrapge: any
  constructor(private consultantservice: ConsultantService, private studentservice: StudentService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private userservice: UserService, private socketService: WebSocketService) { }

  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 0; // Number of items per page
  currentPagemission = 1; // Current page
  currentPagetjm = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {
    this.pageSize = 8

    if (this.mission) {

      this.totalPages = Math.ceil(this.pending_missions.length / this.pageSize);
      const startIndex = (this.currentPagemission - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.pending_missions.length);

      return this.pending_missions.slice(startIndex, endIndex);
    }
    if (this.rattrapge) {

      this.totalPages = Math.ceil(this.rattrapge_requests.length / this.pageSize);
      const startIndex = (this.currentPagemission - 1) * this.pageSize;
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
    if (this.currentPagemission < this.totalPages) {
      this.currentPagemission++;
    }
  }

  previousPage() {
    if (this.currentPagemission > 1) {
      this.currentPagemission--;
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
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    this.user_id = localStorage.getItem('user_id')
    this.new_notif = localStorage.getItem('new_notif');
    this.role = localStorage.getItem('role');
    this.studentservice.getdemandeallverification(this.user_id).subscribe({


      next: (res) => {
        this.tjmrequests = res
        this.studentservice.enseignantsbydepartement(this.tjmrequests[0]["departement"]).subscribe({
          next: (res) => {
            this.ens = res

          }
        })


      },
      error: (e) => {
        // Handle errors
        this.tjmrequests = []
        console.error(e);
        // Set loading to false in case of an error
      }
    });
    this.studentservice.rattrapage_by_department(this.user_id).subscribe({


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

    this.studentservice.getdemandeallpresence(this.user_id).subscribe(
      (response) => {
        this.pending_missions = response
        console.log(this.tjmrequests);

        // Add any additional handling or notifications if needed
      },
      (error) => {
        this.pending_missions = []
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
  showtjm() {
    this.tjm = true
    this.mission = false
    this.rattrapge = false
  }
  showmission() {
    this.tjm = false
    this.mission = true
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
  motif: string = '';
  showPopup1: any
  showPopup2: any
  rattrapage_id: any
  openPopup1(rattrapage_id: any): void {
    this.rattrapage_id = rattrapage_id
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
    this.mission = false
    this.rattrapge = true
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationmission(_id: string) {
    this.router.navigate([clientName + '/mission/' + _id])
  }
  gotovalidemission(mission_id: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + mission_id + '/' + id])
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
