import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';

import { delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;

import { WebSocketService } from 'src/app/services/web-socket.service';
import { UserService } from 'src/app/services/user.service';
import { ConsultantService } from 'src/app/services/consultant.service';
import { DatePipe } from '@angular/common';
import { StudentService } from 'src/app/services/student.service';
const baseUrl = `${environment.baseUrl}`;


declare const PDFObject: any;

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css'],

})
export class ValidationComponent implements OnInit {

  @Input() isLoading: boolean = false;
  personalInfo: any; // Adjust the type as per your data structure
  clientInfo: any;
  consultant_id: any
  missionInfo: any;
  first_nameValidation: boolean = true
  first_nameCause: string = '';
  last_nameValidation: boolean = true
  docsuppValidation: boolean = true
  docsuppCause: string = ''
  last_nameCause: string = ''
  cinValidation: boolean = true
  cinCause: string = ""
  levelValidation: boolean = true
  levelCause: string = ""
  baccalaureateValidation: boolean = true
  baccalaureateCause: string = ""
  codeValidation: boolean = true
  codeCause: string = ""
  adresseValidation: boolean = true
  adresseCause: string = ""
  phoneValidation: boolean = true
  phoneCause: string = ""
  brith_dateValidation: boolean = true
  brith_dateCause: string = ""
  sexeValidation: boolean = true
  sexeCause: string = ""
  father_nameValidation: boolean = true
  father_nameCause: string = ""
  mother_nameValidation: boolean = true
  mother_nameCause: string = ""
  mother_phoneValidation: boolean = true
  mother_phoneCause: string = ""
  father_phoneValidation: boolean = true
  father_phoneCause: string = ""
  father_jobValidation: boolean = true
  father_jobCause: string = ""
  mother_jobValidation: boolean = true
  mother_jobCause: string = ""
  cinimgValidation: boolean = true
  cinimgCause: string = ""
  transcriptsValidation: boolean = true
  transcriptsCause: string = ""
  departementValidation: boolean = true
  departementCause: string = ""
  classeValidation: boolean = true
  classeCause: string = ""
  situationValidation: boolean = true
  situationCause: string = ""

  note1Validation: boolean = true
  note1Cause: string = ""
  note2Validation: boolean = true
  note2Cause: string = ""
  issLoading = false;
  hasCar: any;
  preinscription_id: any
  token: any;
  headers: any
  pdfData: any;
  ispdfdocrib: any
  lastnotifications: any
  notification: string[] = [];
  res: any
  new_notif: any
  formData1: FormGroup;
  constructor(private inscriptionservice: StudentService, private datePipe: DatePipe, private fb: FormBuilder, private router: Router, private consultantService: ConsultantService, private route: ActivatedRoute, private userservice: UserService, private socketService: WebSocketService) {

    this.formData1 = this.fb.group({

      subject: ['', Validators.required],
      message: ['', Validators.required],
      // Add other form controls as needed
    });


  }
  showPopup3: any
  openPopup3(): void {
    this.showPopup3 = true;
  }
  closePopup3(): void {
    this.showPopup3 = false;

  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  loading: boolean = false;

  zoomState: string = 'normal';
  userSelection: string = 'true';

  toggleZoom() {
    this.zoomState = this.zoomState === 'normal' ? 'zoomed' : 'normal';
  }
  nblastnotifications: any
  shownotiff: boolean = false
  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  familyinfo: any
  docs: any
  role: any
  fullname: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.inscriptionservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.inscriptionservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.fullname = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }
    this.new_notif = localStorage.getItem('new_notif');
    this.consultantService.getlastnotificationsrh().subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotifications = res1.slice(0, 10);
        for (let item of this.lastnotifications) {
          //getuserinfomation
          this.consultantService.getuserinfomation(item["userId"], this.headers).subscribe({
            next: (info) => {
              console.log(info);

              item["userId"] = info["firstName"] + ' ' + info["lastName"]
            }
          })
        }
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    const user_id = localStorage.getItem('user_id')
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
    this.consultantService.getRhNotificationsnotseen().subscribe({
      next: (res1) => {
        this.nblastnotifications = res1.length
        this.lastnotifications = res1

      },
      error: (e) => {
        // Handle errors
        this.nblastnotifications = 0
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log(event);

      if (event.notification.toWho == "RH") {
        this.lastnotifications.push(event.notification.typeOfNotification)
        this.nblastnotifications = this.lastnotifications.length
        this.notification.push(event.notification.typeOfNotification)
        localStorage.setItem('new_notif', 'true');
      }

      // Handle your rhNotification event here
    });
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.preinscription_id = params['id'];
    });
    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);

    // Check if token is available
    if (this.token) {
      // Include the token in the headers

      this.inscriptionservice.getinscrption(this.preinscription_id).subscribe({
        next: (res) => {
          // Handle the response from the server
          console.log(res);

          this.consultant_id = res.preregister.user_id
          this.personalInfo = res.preregister.personalInfo;
          this.familyinfo = res.preregister.family_info;
          this.docs = res.preregister.docs
          this.docs.cin = baseUrl + "uploads/" + this.docs.cin
          this.docs.img_profil = baseUrl + "uploads/" + this.docs.img_profil
          this.docs.transcripts = baseUrl + "uploads/" + this.docs.transcripts
          this.docs.img_docsupp = baseUrl + "uploads/" + this.docs.img_docsupp
          if (this.docs.baccalaureate) {
            this.docs.baccalaureate = baseUrl + "uploads/" + this.docs.baccalaureate

          }

          if (this.docs.note1) {
            this.docs.note1 = baseUrl + "uploads/" + this.docs.note1
          }
          if (this.docs.note2) {
            this.docs.note2 = baseUrl + "uploads/" + this.docs.note2
          }
          this.personalInfo.identificationDocument.value = baseUrl + "uploads/" + this.personalInfo.identificationDocument.value
          this.personalInfo.dateOfBirth.value = this.personalInfo.dateOfBirth.value.split('T')[0]
          this.personalInfo.carInfo.drivingLicense.value = baseUrl + "uploads/" + this.personalInfo.carInfo.drivingLicense.value
          this.personalInfo.ribDocument.value = baseUrl + "uploads/" + this.personalInfo.ribDocument.value
          this.missionInfo.isSimulationValidated.value = baseUrl + "uploads/" + this.missionInfo.isSimulationValidated.value
          this.missionInfo.startDate.value.split('T')[0]
          this.hasCar = this.personalInfo.carInfo.hasCar.value;
          this.loading = false;
          this.isLoading = true;
          // if (this.personalInfo.ribDocument.value.endsWith('.pdf')) {
          //   this.inscriptionservice.getPdf(this.personalInfo.ribDocument.value).subscribe({
          //     next: (res) => {
          //       this.pdfData = res;
          //       this.isLoading = false;
          //       if (this.pdfData) {
          //         this.handlesecondRenderPdf(this.pdfData);
          //       }
          //     },
          //   });
          //   this.ispdfdocrib = true
          // } else {
          //   this.ispdfdocrib = false
          // }

          // this.inscriptionservice.getPdf(this.missionInfo.isSimulationValidated.value).subscribe({
          //   next: (res) => {
          //     this.pdfData = res;
          //     this.isLoading = false;
          //     if (this.pdfData) {
          //       this.handleRenderPdf(this.pdfData);
          //     }
          //   },
          // });
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error
          this.loading = false;
        }
      });
    }
  }
  update_register() {
    const data = {
      "first_nameValidation": this.first_nameValidation,
      "first_nameCause": this.first_nameCause,
      "last_nameValidation": this.last_nameValidation,
      "docsuppValidation": this.docsuppValidation,
      "docsuppCause": this.docsuppCause,
      "last_nameCause": this.last_nameCause,
      "cinValidation": this.cinValidation,
      "cinCause": this.cinCause,
      "levelValidation": this.levelValidation,
      "levelCause": this.levelCause,
      "baccalaureateValidation": this.baccalaureateValidation,
      "baccalaureateCause": this.baccalaureateCause,
      "codeValidation": this.codeValidation,
      "codeCause": this.codeCause,
      "adresseValidation": this.adresseValidation,
      "adresseCause": this.adresseCause,
      "phoneValidation": this.phoneValidation,
      "phoneCause": this.phoneCause,
      "brith_dateValidation": this.brith_dateValidation,
      "brith_dateCause": this.brith_dateCause,
      "sexeValidation": this.sexeValidation,
      "sexeCause": this.sexeCause,
      "father_nameValidation": this.father_nameValidation,
      "father_nameCause": this.father_nameCause,
      "mother_nameValidation": this.mother_nameValidation,
      "mother_nameCause": this.mother_nameCause,
      "mother_phoneValidation": this.mother_phoneValidation,
      "mother_phoneCause": this.mother_phoneCause,
      "father_phoneValidation": this.father_phoneValidation,
      "father_phoneCause": this.father_phoneCause,
      "father_jobValidation": this.father_jobValidation,
      "father_jobCause": this.father_jobCause,
      "mother_jobValidation": this.mother_jobValidation,
      "mother_jobCause": this.mother_jobCause,
      "cinimgValidation": this.cinimgValidation,
      "cinimgCause": this.cinimgCause,
      "transcriptsValidation": this.transcriptsValidation,
      "transcriptsCause": this.transcriptsCause,
      "departementValidation": this.departementValidation,
      "departementCause": this.departementCause,
      "classeValidation": this.classeValidation,
      "classeCause": this.classeCause,
      "situationValidation": this.situationValidation,
      "situationCause": this.situationCause,
      "note1Validation": this.note1Validation,
      "note1Cause": this.note1Cause,
      "note2Validation": this.note1Validation,
      "note2Cause": this.note2Cause,
    };

    Swal.fire({
      title: "Confirmez l'action",

      html: `
        <div  style="backgound-color:red">
        <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre valider cette inscription ?  </div> 
        
        </div>
      `,
      iconColor: '#CDC7B9',
      showCancelButton: true,
      background: 'white',
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
        this.inscriptionservice.rhvalidation(data, this.preinscription_id).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire({
              background: 'white',

              title: 'Pré-inscription mise à jour avec succès !',
              confirmButtonText: 'OK',
              confirmButtonColor: "rgb(0, 17, 255)",
              timer: 1500
            });
            this.router.navigate([clientName + '/dashboard'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', "Échec de la mise à jour de l'enregistrement.", 'error');
          }
        });
      } else {
        Swal.fire({
          background: 'white',
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          confirmButtonText: 'Ok',
          confirmButtonColor: "rgb(0, 17, 255)",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });

  }
  handlesecondRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  // killmission(killed: any) {
  //   console.log(killed);
  //   if (killed == true) {


  //     this.inscriptionservice.killmission(this.preinscription_id, this.headers).subscribe({
  //       next: (res) => {
  //         console.log(res);

  //       }

  //     })
  //   }

  // }
  gotoconsultantprofil() {
    this.router.navigate([clientName + '/students/' + this.consultant_id])

  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  onRadioChange(value: boolean) {
    // Update hasCar based on radio button change
    this.hasCar = value;
  }

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');


  }

  sendmail() {
    Swal.fire({
      title: 'Confirmez l\'envoi de l\'email',
      html: `
        <div>
          <div style="font-size:1.2rem;">Êtes-vous sûr de vouloir <br> envoyer cet email ?'</div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      background: 'white',
      confirmButtonColor: "rgb(0, 17, 255)",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        const formData1 = this.formData1.value;
        const data = {

          "subject": formData1.subject,
          "message": formData1.message
        };
        this.inscriptionservice.sendemailconsultant(this.consultant_id, data).subscribe({
          next: (res) => {
            // Handle the response from the server
            Swal.fire({
              background: 'white',
              title: 'Email envoyé',
              text: 'L\'email a été envoyé avec succès !',
              confirmButtonColor: "rgb(0, 17, 255)",

            });
            this.showPopup3 = false;
          },
          error: (e) => {
            console.log(e);
            // Handle errors
            Swal.fire({
              background: 'white',
              title: 'Erreur d\'envoi',
              text: "L'envoi de l'email a échoué. Veuillez réessayer.",
              confirmButtonColor: "rgb(0, 17, 255)",
            });
          }
        });
      } else {
        Swal.fire({

          title: 'Envoi annulé',
          text: 'Aucun email n\'a été envoyé.',
          background: 'white',
          confirmButtonColor: "rgb(0, 17, 255)",
          confirmButtonText: 'Ok',

        });
      }
    });
  }

}
