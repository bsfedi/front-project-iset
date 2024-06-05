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
import { jsPDF } from "jspdf";
declare let html2pdf: any
const clientName = `${environment.default}`;
@Component({
  selector: 'app-tjmrequests',
  templateUrl: './tjmrequests.component.html',
  styleUrls: ['./tjmrequests.component.css']
})
export class tjmrequestsComponent {
  token: any
  headers: any
  user_id: any
  tjmrequests: any
  formData: { typeVirement: string; montant: string } = { typeVirement: '', montant: '' };
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  new_notif: any
  nblastnotifications: any
  show: any
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
    this.pageSize = 10

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
      this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
      const startIndex = (this.currentPagetjm - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.filteredItems.length);
      return this.filteredItems.slice(startIndex, endIndex);
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
  salles: any

  fullname: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.show = true
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







    if (this.role === 'directeuretudes') {
      this.studentservice.verifications().subscribe({


        next: (res) => {
          this.tjmrequests = res
          this.filteredItems = this.tjmrequests
          this.studentservice.enseignants().subscribe({
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
    } else {
      this.studentservice.getdemandeallverification(this.user_id).subscribe({


        next: (res) => {
          this.tjmrequests = res
          this.filteredItems = this.tjmrequests
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
    }
    if (this.role === 'directeuretudes') {
      this.studentservice.rattrapages().subscribe({


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
    } else {
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
    }


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
    if (this.role === 'directeuretudes') {
      this.studentservice.presences().subscribe({


        next: (res) => {
          this.pending_missions = res


        },
        error: (e) => {
          // Handle errors
          this.pending_missions = []
          console.error('Error getting virement:', e);
          // Set loading to false in case of an error
        }
      });

    }
    else {
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

  }
  filteredItems: any[] = [];
  searchTerm: any
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.tjmrequests;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.tjmrequests.filter((item: any) =>
        item.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.last_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.classe.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  accept(demande_id: any) {
    const data = {
      "role": this.role,
      "validated": true

    }
    this.studentservice.update_status_demande_bychef(demande_id).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande acceptée  avec succès! </div> 
              
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

  accept_note(demande_id: any, status: any) {

    this.studentservice.accept_note(this.role, demande_id, status).subscribe({
      next: (res) => {
        if (status == 'True') {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> verification de note validée  avec succès! </div> 
                
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
        }
        else {
          Swal.fire({

            background: 'white',
            html: `
              <div>
              <div style="font-size:1.2rem"> verification de note refusé  avec succès! </div> 
                
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
        }

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
      "new_horaire": this.horaire,
      "date": this.date,
      "classe": this.classe,
      "module": this.module,
      "horaire": this.inputHoraire
    }
    this.studentservice.update_rattrapage(this.rattrapage_id, data).subscribe({
      next: (res) => {

        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> demande acceptée  avec succès! </div> 
              
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
  refuse_rattrapage() {
    const data = {
      "salle": this.Salle,
      "new_horaire": this.horaire,
      "date": this.date,
      "classe": this.classe,
      "module": this.module,
      "horaire": this.inputHoraire,
      "status": "invalidated",
      "motif": this.motif
    }
    this.studentservice.update_rattrapage(this.rattrapage_id, data).subscribe({
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
  motif: string = '';
  showPopup1: any
  showPopup2: any
  rattrapage_id: any
  openPopup1(rattrapage_id: any, date: any, classe: any, inputHoraire: any, module: any): void {
    this.rattrapage_id = rattrapage_id

    this.date = date
    this.classe = classe
    this.inputHoraire = inputHoraire
    this.module = module
    this.rattrapage_id = rattrapage_id
    this.showPopup1 = true;
  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  historiques: any
  date: any
  classe: any
  inputHoraire: any
  module: any
  openPopup2(rattrapage_id: any, date: any, classe: any, inputHoraire: any, module: any): void {
    this.rattrapage_id = rattrapage_id
    this.showPopup2 = true;
    this.date = date
    this.classe = classe
    this.inputHoraire = inputHoraire
    this.module = module
    this.studentservice.get_sallesinputHoraire(date, inputHoraire).subscribe({


      next: (res) => {
        this.salles = res




      },
      error: (e) => {
        // Handle errors
        this.tjmrequests = []
        console.error(e);
        // Set loading to false in case of an error
      }
    });
    this.studentservice.get_historique(date, classe).subscribe({


      next: (res) => {

        this.historiques = res
        console.log(res);

      },
      error: (e) => {
        // Handle errors

        console.error(e);
        // Set loading to false in case of an error
      }
    });

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
  Attestation_de_presence() {
    // Get the data for the table
    const displayedDocs = this.pending_missions

    // Generate the table rows dynamically
    const tableRows = displayedDocs.map((item: any) => `
        <tr>
            <td>${item.first_name} ${item.first_name}</td>
            <td>${item.datedepot.split(['T'])[0]}</td>

            <td>
              ${item.nb_arab}
            </td>
            <td>
            ${item.nb_arab}
          </td>
        </tr>
    `).join('');

    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 90%;
                margin-top: 20px;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }

            </style>
          </head>
          <body>
          <div  style='text-align:center;display:flex'> 
          <img src="/assets/logoisetnabeul.jpg" style="width:20%;hiegth:20%">
          <div style="margin-top:30px">
          Ministère de l’Enseignement Supérieur et de la Recherche Scientifique <br> 
          Direction Générale des Etudes Technologiques <br> 
          Institut Supérieur des Etudes Technologiques de Nabeul
          </div> </div> <br> <br>

          <b style='text-align:center;'> Liste des attestations  </b><br> <br>
            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Etudiant</th>
                    <th>Date demande</th>
                    <th>attestation en arabe</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">attestation en francais</th>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
          </body>
        </html>`;

    // Generate PDF from HTML content
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'Attestation_de_presence.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
  }
  verification_des_notes() {
    // Get the data for the table
    const displayedDocs = this.filteredItems

    // Generate the table rows dynamically
    const tableRows = displayedDocs.map((item: any) => `
        <tr>
        <td>${item.first_name} ${item.last_name}</td>
        <td>${item.status === 'validated' ? 'Acceptée' : 'Refusée'}</td>
        <td>${item.new_note}</td>
        <td>${item.note}</td>
        <td>${item.matiere}</td>
        <td>${item.classe}</td>
        
        </tr>
    `).join('');

    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 98%;
                margin-top: 30px;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }

            </style>
          </head>
          <body>
          <div  style='text-align:center;display:flex'> 
          <img src="/assets/logoisetnabeul.jpg" style="width:20%;hiegth:20%">
          <div style="margin-top:30px">
          Ministère de l’Enseignement Supérieur et de la Recherche Scientifique <br> 
          Direction Générale des Etudes Technologiques <br> 
          Institut Supérieur des Etudes Technologiques de Nabeul
          </div> </div> <br> <br>

          <b style='text-align:center;margin-left:230px'> Liste des verification des notes  </b><br> <br>
            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Etudiant</th>
                    <th> Décision </th>
                    <th> Nouvelle note</th>
                    <th>note</th>
                  
                    <th>matiere</th>
                   
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">classe</th>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
          </body> <br><br>
        </html>`;

    // Generate PDF from HTML content
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'Vérification_des_notes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
  }
  Demande_Rattrapge() {
    // Get the data for the table
    const displayedDocs = this.rattrapge_requests;

    // Generate the table rows dynamically
    const tableRows = displayedDocs.map((item: any) => `
        <tr>
            <td>${item.id_demande}</td>
            <td>${item.date_depot.split('T')[0]}</td>
            <td>${item.enseignant_id}</td>
            <td>
                ${item.data.map((ee: any) => `<div *ngIf="ee.inputClass"><b>${ee.inputClass} - ${ee.inputModule} - ${ee.inputHoraire} - ${ee.date}</b></div>`).join('')}
            </td>
            <td>${item.data[0].status}</td>
        </tr>
    `).join('');

    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 98%;
                margin-top: 30px;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
          <div  style='text-align:center;display:flex'> 
          <img src="/assets/logoisetnabeul.jpg" style="width:20%;hiegth:20%">
          <div style="margin-top:30px">
          Ministère de l’Enseignement Supérieur et de la Recherche Scientifique <br> 
          Direction Générale des Etudes Technologiques <br> 
          Institut Supérieur des Etudes Technologiques de Nabeul
          </div> </div> <br> <br>

          <b style='text-align:center;'> Liste des demandes Rattrapge  </b><br> <br>
            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">ID</th>
                    <th>Date demande</th>
                    <th>Enseignanat</th>
                    <th>Module</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">Etat</th>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
          </body>
        </html>`;

    // Generate PDF from HTML content
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'Demande_Rattrapge.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
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
