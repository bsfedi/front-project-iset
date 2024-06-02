import { Component, ElementRef, ViewChild } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

declare const PDFObject: any;
import { environment } from 'src/environments/environment';


const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { StudentService } from 'src/app/services/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-cours',
  templateUrl: './support-cours.component.html',
  styleUrls: ['./support-cours.component.css']
})
export class SupportCoursComponent {
  res: any
  headers: any
  selectedFile: File | null = null;
  isSimulationValidated: any
  permis_img: any
  rib_img: any
  myForm2: FormGroup;
  docs: any
  pdfData: any
  card: any
  @ViewChild('fileInput') fileInput: ElementRef | any;
  @ViewChild('fileInputdrivinglicence') fileInputdiving: ElementRef | any;
  @ViewChild('fileInputdib') fileInputdib: ElementRef | any;
  openFileInput() {
    // Trigger click event on the hidden file input
    this.fileInput.nativeElement.click();
  }
  openfileInputdrivinglicenceInput() {
    this.fileInputdiving.nativeElement.click();
  }
  openfileInputdibInput() {
    this.fileInputdib.nativeElement.click();
  }
  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private consultantservice: ConsultantService, private router: Router, private socketService: WebSocketService, private studentservice: StudentService, private userservice: UserService, private http: HttpClient, private datePipe: DatePipe) {
    this.myForm2 = this.fb.group({
      classe_id: ['', Validators.required],
      titre: ['', Validators.required],
    });
  }
  card_view() {
    this.card = true
  }
  downloadFile(urlpdf: any, filename: any) {
    console.log(urlpdf);
    console.log(filename);


    this.consultantservice.downloadpdffile(urlpdf, filename)

  }
  list_view() {
    this.card = false
  }
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  pdfcontainer1: any
  notification: string[] = [];
  res1: any
  fullname: any
  role: any
  show: any
  departement: any
  all_classes: any
  all_modules: any
  all_moduless: any
  user_id: any
  showPopup = false
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }

  enseignants: any
  shownotiff: boolean = false
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
    this.user_id = user_id
    this.new_notif = localStorage.getItem('new_notif');
    this.socketService.connect()
    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.preregister.personalInfo.first_name + " " + res.preregister.personalInfo.last_name
          this.studentservice.get_documents_by_classe(res.preregister.personalInfo.classe).subscribe({
            next: (res) => {
              // Handle the response from the server
              this.docs = res;

              for (let i = 0; i < this.docs.length; i++) {
                const item = this.docs[i];

                if (item.document.endsWith('.pdf')) {
                  item.pdf = true;
                  item.document = baseUrl + "uploads/" + item.document;
                  this.inscriptionservice.getPdf(item.document).subscribe({
                    next: (res) => {
                      const pdfData = res;
                      console.log(pdfData);

                      if (pdfData) {
                        this.handleRenderPdf(i, pdfData); // Pass index to dynamically generate function name
                      }
                    },
                  });
                } else {
                  item.pdf = false;
                  item.document = baseUrl + "uploads/" + item.document;
                }
              }
              console.log(this.docs);
            },
            error: (e) => {
              // Handle errors
              console.error(e);
              // Set loading to false in case of an error
            }
          });
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.show = true
          this.fullname = res.first_name + " " + res.last_name
          this.departement = res.departement
          this.studentservice.get_documents(user_id).subscribe({
            next: (res) => {
              // Handle the response from the server
              this.docs = res;

              for (let i = 0; i < this.docs.length; i++) {
                const item = this.docs[i];

                if (item.document.endsWith('.pdf')) {
                  item.pdf = true;
                  item.document = baseUrl + "uploads/" + item.document;
                  this.inscriptionservice.getPdf(item.document).subscribe({
                    next: (res) => {
                      const pdfData = res;
                      console.log(pdfData);

                      if (pdfData) {
                        this.handleRenderPdf(i, pdfData); // Pass index to dynamically generate function name
                      }
                    },
                  });
                } else {
                  item.pdf = false;
                  item.document = baseUrl + "uploads/" + item.document;
                }
              }
              console.log(this.docs);
            },
            error: (e) => {
              // Handle errors
              console.error(e);
              // Set loading to false in case of an error
            }
          });
          this.studentservice.get_classe_module_by_dep(res.departement).subscribe({
            next: (res) => {
              this.all_classes = res.all_calsse
              this.all_modules = res.all_modules
            }, error(e) {
              console.log(e);

            }
          });
          this.studentservice.get_all_modules().subscribe({
            next: (res) => {
              this.all_moduless = res


            }
          })

          this.studentservice.enseignantsbydepartement(res.departement).subscribe({
            next: (res) => {
              this.enseignants = res


            }
          })
        }, error(e) {
          console.log(e);

        }
      });
    }
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
    this.consultantservice.getallnotification(user_id).subscribe({
      next: (res1) => {
        this.res1 = res1
        this.nblastnotifications = this.res1.length
        this.lastnotifications = this.res1

      },
      error: (e) => {
        this.nblastnotifications = 0
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

    }




  }

  verification_absence() {
    console.log(this.fileInputs);

    const formData = new FormData();
    if (this.fileInputs.isSimulationValidated
    ) {
      const isSimulationValidatedeee = this.fileInputs?.isSimulationValidated.files[0];
      formData.append('document', isSimulationValidatedeee);
    }
    formData.append('uploaded_by', this.user_id);
    formData.append('classe_id', this.myForm2.value.classe_id);
    formData.append('titre', this.myForm2.value.titre);


    this.studentservice.add_document(formData).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        Swal.fire({

          background: 'white',
          html: `
            <div>
            <div style="font-size:1.2rem"> document ajoutée avec succès! </div> 
              
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
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });


  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page

  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.docs.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.docs.length);


    return this.docs.slice(startIndex, endIndex);



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
  handleRenderPdf(index: any, data: any) {
    const pdfObject = PDFObject.embed(data, `#pdfContainer${index}`);
  }

  handleRenderPdf1(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  handleRenderPdf2(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer2');

  }
  handleRenderPdf3(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer3');

  }
  editisSimulationValidated(id: any) {


  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  setFileInput(field: string, event: any): void {
    const user_id = localStorage.getItem('user_id')
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'isSimulationValidated') {
          this.isSimulationValidated = e.target!.result as string;
          const formData = new FormData();
          const isSimulationValidated = this.fileInputs.isSimulationValidated.files[0];

          console.log(isSimulationValidated);

          // Append the files if they exist, else append empty strings
          formData.append('isSimulationValidated', isSimulationValidated);
          console.log(formData);


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

  // Dans votre composant TypeScript
  downloadDocument(documentUrl: string, documentName: string): void {
    // Créez un élément <a> pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName;

    // Ajoutez l'élément à la page et déclenchez le téléchargement
    document.body.appendChild(link);
    link.click();

    // Supprimez l'élément du DOM après le téléchargement
    document.body.removeChild(link);
  }
}
