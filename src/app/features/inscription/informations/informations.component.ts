import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare const PDFObject: any;
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
const baseUrl = `${environment.baseUrl}`;

const clientName = `${environment.default}`;
@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent {
  @ViewChild('identificationDocument') fileInputdiving: ElementRef | any;
  @Input() isLoading: boolean = false;
  personalInfo: any; // Adjust the type as per your data structure
  familyinfo: any;
  missionInfo: any;
  status_preregister: any
  toggleValue: string = 'a';
  preinscription_id: any
  hasCar: any;
  pdfData: any;
  headers: any;
  docs: any
  myForm: FormGroup;
  cin_img: string | null = null;
  constructor(private inscriptionservice: StudentService, private userservice: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      cin: ['', [Validators.required, Validators.email]],
      level: ['', Validators.required],
      code: ['', Validators.required],
      location: ['', Validators.required],
      adresse: ['', Validators.required],
      phone: ['', Validators.required],
      brith_date: ['', Validators.required],
      sexe: ['', Validators.required],
      departement: ['', Validators.required],
      classe: ['', Validators.required],
      situation: ['', Validators.required],
      cin_img: ['', Validators.required],
      transcripts: ['', Validators.required],
      baccalaureate: ['', Validators.required],
      father_name: ['', Validators.required],
      mother_name: ['', Validators.required],
      mother_phone: ['', Validators.required],
      father_phone: ['', [Validators.required, Validators.email]],
      father_job: ['', Validators.required],
      mother_job: ['', Validators.required],

    });
  }
  loading: boolean = true;

  zoomState: string = 'normal';
  userSelection: string = 'true';
  toggleZoom() {
    this.zoomState = this.zoomState === 'normal' ? 'zoomed' : 'normal';
  }
  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.myForm.patchValue({
      identificationDocument: file
    });
  }

  getDocumentUrl(): string {
    // Assuming your server serves the identification document images
    // Adjust the URL or logic based on your server setup
    const fileId = this.missionInfo.isSimulationValidated.value;
    return this.missionInfo.isSimulationValidated.value ? `https://my-krew-8nnq.onrender.com/uploads/${fileId}` : '';
  }
  identificationDocumentpdf: boolean = false
  classes: any
  ngOnInit(): void {
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.preinscription_id = params['id']
    });
    const token = localStorage.getItem('token');




    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.inscriptionservice.getinscrption(this.preinscription_id).subscribe({
        next: (res) => {
          // Handle the response from the server
          console.log(res);

          this.status_preregister = res.preregister.status
          this.personalInfo = res.preregister.personalInfo;
          this.familyinfo = res.preregister.family_info;
          this.docs = res.preregister.docs
          this.docs.img_profil = baseUrl + "uploads/" + this.docs.img_profil
          this.docs.cin = baseUrl + "uploads/" + this.docs.cin
          this.docs.transcripts = baseUrl + "uploads/" + this.docs.transcripts
          this.inscriptionservice.get_classes_bydep(this.personalInfo.departement).subscribe({
            next: (res) => {


              this.classes = res
            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          })
          if (this.docs.note1) {
            this.docs.note1 = baseUrl + "uploads/" + this.docs.note1
          }
          if (this.docs.note2) {
            this.docs.note2 = baseUrl + "uploads/" + this.docs.note2
          }
          this.personalInfo.brith_date = this.personalInfo.brith_date.split('T')[0]
          this.hasCar = this.personalInfo.carInfo.hasCar.value;


          if (this.personalInfo.identificationDocument.value.endsWith('.pdf')) {
            console.log(this.personalInfo.identificationDocument.value);

            // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.personalInfo.identificationDocument.value).subscribe({
            //   next: (res) => {
            //     this.pdfData = res;
            //     this.identificationDocumentpdf = true;
            //     if (this.pdfData) {
            //       this.handleRenderPdf1(this.pdfData);
            //     }
            //   },
            // });

          }
          this.personalInfo.carInfo.drivingLicense.value = baseUrl + "uploads/" + this.personalInfo?.carInfo.drivingLicense.value
          // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.missionInfo.isSimulationValidated.value).subscribe({
          //   next: (res) => {
          //     this.pdfData = res;
          //     this.isLoading = false;
          //     if (this.pdfData) {
          //       this.handleRenderPdf(this.pdfData);
          //     }
          //   },
          // });

          // this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.personalInfo.ribDocument.value).subscribe({
          //   next: (res) => {
          //     this.pdfData = res;
          //     this.isLoading = false;
          //     if (this.pdfData) {
          //       this.handlesecondRenderPdf(this.pdfData);
          //     }
          //   },
          // });





          this.loading = false;
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
  onRadioChange(value: boolean) {
    // Update hasCar based on radio button change
    this.hasCar = value;
  }
  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');

  }
  handleRenderPdf1(data: any) {

    const pdfObject = PDFObject.embed(data, '#identificationDocumentpdf');

  }
  handlesecondRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  edit() {

    const formData = new FormData();

    // Append the identificationDocument file
    // const identificationDocumentFile = this.myForm.value.identificationDocument;
    // formData.append('identificationDocument', identificationDocumentFile);
    // Append values directly to formData
    formData.append('first_name', this.myForm.value.first_name);
    formData.append('last_name', this.myForm.value.last_name);
    formData.append('cin', this.myForm.value.cin);
    formData.append('level', this.myForm.value.level);
    formData.append('code', this.myForm.value.code);
    formData.append('adresse', this.myForm.value.adresse);
    formData.append('phone', this.myForm.value.phone);
    formData.append('brith_date', this.myForm.value.brith_date);
    // formData.append('cin_img', this.docs.cin_img.split('uploads/')[1]);
    formData.append('sexe', this.myForm.value.sexe);
    formData.append('departement', this.myForm.value.departement);
    // formData.append('transcripts', this.docs.transcripts.split('uploads/')[1]);
    formData.append('classe', this.myForm.value.classe);
    formData.append('father_name', this.myForm.value.father_name);
    formData.append('mother_name', this.myForm.value.mother_name);
    formData.append('mother_phone', this.myForm.value.mother_phone);
    formData.append('father_phone', this.myForm.value.father_phone);
    formData.append('father_job', this.myForm.value.father_job);
    formData.append('mother_job', this.myForm.value.mother_job);
    formData.append('situation', this.myForm.value.situation)
    // formData.append('baccalaureate', this.docs.baccalaureate.split('uploads/')[1]);





    // Display confirmation popup
    Swal.fire({
      title: 'Confirmer les modifications',
      text: "Êtes-vous sûr de vouloir mettre à jour la demande de pré-inscription ?",
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettez à jour !',
      confirmButtonColor: "rgb(0, 17, 255)",

      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'custom-confirm-button-class'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes', call the endpoint
        const payload = {
          "personalInfo": {
            "first_name": this.myForm.value.first_name,
            "last_name": this.myForm.value.last_name,
            "cin": this.myForm.value.cin,
            "level": this.myForm.value.level,
            "baccalaureate": this.personalInfo.baccalaureate,
            "annee": this.personalInfo.annee,
            "code": this.personalInfo.code,
            "adresse": this.myForm.value.adresse,
            "phone": this.myForm.value.phone,
            "brith_date": this.myForm.value.brith_date,
            "sexe": this.myForm.value.sexe,
            "departement": this.myForm.value.departement,
            "classe": this.myForm.value.classe,
            "situation": this.myForm.value.situation
          },
          "student_family": {
            "father_name": this.myForm.value.father_name,
            "mother_name": this.myForm.value.mother_name,
            "mother_phone": this.myForm.value.mother_phone,
            "father_phone": this.myForm.value.father_phone,
            "father_job": this.myForm.value.father_job,
            "mother_job": this.myForm.value.mother_job
          }
        }
        this.inscriptionservice.update_register(payload, this.preinscription_id).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire({
              icon: "success",
              title: 'Pré-inscription mise à jour avec succès !',
              confirmButtonText: 'OK',
              confirmButtonColor: "rgb(0, 17, 255)",
            });
            this.router.navigate([clientName + '/pending'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            // Set loading to false in case of an error
            this.loading = false;
          }
        });
      } else {
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          icon: 'info',
          iconColor: '#1E1E1E',

          confirmButtonText: 'Ok',
          confirmButtonColor: "#1E1E1E",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });


  }
  openidentificationDocumentInput() {
    this.fileInputdiving.nativeElement.click();
  }
  fileInputs: any = {};
  selectedFile: File | null = null;
  identificationDocument: any
  permis_img: any
  rib_img: any
  setFileInput(field: string, event: any): void {
    const user_id = localStorage.getItem('user_id')
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'identificationDocument') {
          this.identificationDocument = e.target!.result as string;
          const formData = new FormData();
          const identificationDocument = this.fileInputs.identificationDocument.files[0];
          // Append the files if they exist, else append empty strings
          this.myForm.value.identificationDocument = identificationDocument

        }
        else if (field == 'drivingLicense') {
          this.permis_img = e.target!.result as string;
          const formData = new FormData();
          const drivingLicense = this.fileInputs.drivingLicense.files[0];



          // Append the files if they exist, else append empty strings
          formData.append('drivingLicense', drivingLicense);
          console.log(formData);

          this.userservice.editDrivingLiscence(user_id, formData).subscribe({

            next: (res) => {
              console.log(formData);

              console.log("drivingLicense", res);

            }, error: (e) => {
              console.log(e);

            }
          });

        }
        else if (field == 'ribDocument') {
          this.rib_img = e.target!.result as string;
          const formData = new FormData();
          const ribDocument = this.fileInputs.ribDocument.files[0];



          // Append the files if they exist, else append empty strings
          formData.append('ribDocument', ribDocument);


          this.userservice.editribdocument(user_id, formData).subscribe({

            next: (res) => {
              console.log(formData);

              console.log("drivingLicense", res);

            }, error: (e) => {
              console.log(e);

            }
          });

        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
