import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { jsPDF } from "jspdf";
declare let html2pdf: any
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { StudentService } from 'src/app/services/student.service';
const baseUrl = `${environment.baseUrl}`;
const clientName = `${environment.default}`;

@Component({
  selector: 'app-consultant-mission',
  templateUrl: './consultant-mission.component.html',
  styleUrls: ['./consultant-mission.component.css']
})
export class ConsultantMissionComponent {
  items: any;
  showfilter: boolean = false
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  clientValidation: any
  contactClient: any
  pageSize = 8; // Number of items per page
  currentPage = 1; // Current page
  currentPage14 = 1
  pageSize14 = 8
  currentPage15 = 1
  pageSize15 = 8
  totalPages: any;
  totalPages14: any
  totalPages15: any
  nbdemande: any
  contractValidation: any
  roleofcurrent_user: any
  show: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  user_id: any
  user_info: any
  fileInputs: any = {}; // Initialize fileInputs object
  document: string | null = null; // Initialize document property
  selectedFile: any
  myForm: FormGroup;
  docs: any
  virementTypes = ['Avertissement', 'Blame', 'Renvoi', 'Exclusion'];
  foremData: FormGroup;
  formData1: FormGroup;
  show_mission: boolean = false
  show_doc: boolean = true
  show_historique: boolean = false
  res: any
  res14: any
  filteredItems: any[] = [];
  showPopup3: any
  searchTerm: any
  searchTerm1: any
  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService,
    private studentservice: StudentService,
    private datePipe: DatePipe,
    private userservice: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so add 1
    const day = today.getDate();
    // this.selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.foremData = this.fb.group({

      type: ['Participation', Validators.required],
      motif: ['', Validators.required],
      date: ['']
      // Add other form controls as needed
    });
    this.formData1 = this.fb.group({
      email: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      // Add other form controls as needed
    });

    this.myForm = this.fb.group({

      documentName: ['', Validators.required],
      userDocument: ['', Validators.required],
      // Add other form controls as needed
    });
  }
  allcra: any
  preinscription_id: any
  personalInfo: any
  familyinfo: any
  validation: any
  user_email: any
  validated_mission: any
  student_id: any
  data_orientation: any
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
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
    this.roleofcurrent_user = localStorage.getItem('role');
    this.route.params.subscribe((params) => {
      this.user_id = params['id'];
      this.preinscription_id = params['id'];
    });


    this.studentservice.getinscrption(this.preinscription_id).subscribe({
      next: (res) => {
        this.show = true
        this.student_id = res.preregister.user_id
        // Handle the response from the server
        this.studentservice.sancttions(this.student_id).subscribe({
          next: (res) => {
            this.sanctions = res

          }
        })
        this.studentservice.getorientation(this.student_id).subscribe({
          next: (res) => {
            this.data_orientation = res
          }
        })
        this.studentservice.getuserbyid(this.student_id).subscribe({
          next: (res) => {
            this.user_email = res.email
          }
        })
        if (this.roleofcurrent_user == 'tuitionofficer') {
          this.studentservice.validated_attestation(res.preregister.user_id).subscribe({
            next: (res) => {
              this.validated_mission = res;


            },
            error: (e) => {
              // Handle errors
              this.validated_mission = [];
              console.error(e);

              // Set loading to false in case of an error
            },
          });
        } else {
          this.studentservice.getdemandeattestation(res.preregister.user_id).subscribe({
            next: (res) => {
              this.validated_mission = res;


            },
            error: (e) => {
              // Handle errors
              this.validated_mission = [];
              console.error(e);

              // Set loading to false in case of an error
            },
          });
        }

        this.validation = res.preregister.validation.paymenttype
        console.log(this.validation);
        this.show_doc = true
        this.personalInfo = res.preregister.personalInfo;
        this.familyinfo = res.preregister.family_info;
        this.docs = res.preregister.docs
        this.docs.cin = baseUrl + "uploads/" + this.docs.cin
        this.docs.transcripts = baseUrl + "uploads/" + this.docs.transcripts

        this.personalInfo.brith_date = this.personalInfo.brith_date.split('T')[0]


        if (this.personalInfo.identificationDocument.value.endsWith('.pdf')) {
          console.log(this.personalInfo.identificationDocument.value);

        }
        this.personalInfo.carInfo.drivingLicense.value = baseUrl + "uploads/" + this.personalInfo?.carInfo.drivingLicense.value

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

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
    const token = localStorage.getItem('token');


    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        // Sort the response array by createdAt in ascending order
        this.res14 = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);


        this.res14 = this.res14.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });

    this.consultantservice.get_all_cra_by_userid(this.user_id).subscribe({


      next: (res) => {
        this.allcra = res
        this.allcra = this.allcra.craPdfs


        console.log("allcra", this.allcra);

        for (let item of this.allcra) {

          console.log("item", item);

          console.log("filename", item.filename);


          item.filename = baseUrl + "uploads/" + item.filename
          this.inscriptionservice.getPdf(item.filename).subscribe({

          });
        }
        // Handle the response from the server
        console.log("allc_cra_pdf", res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });



    // this.userservice.getAllDacumentsofuser(this.user_id).subscribe({


    //   next: (res) => {
    //     // Handle the response from the server
    //     this.docs = res
    //     this.filteredItems = this.docs
    //     for (let item of this.filteredItems) {
    //       if (item.document.endsWith('.pdf')) {
    //         item.pdf = true
    //         item.document = baseUrl + "uploads/" + item.document
    //         this.inscriptionservice.getPdf(item.document).subscribe({

    //         });

    //       } else {
    //         item.pdf = false
    //         item.document = baseUrl + "uploads/" + item.document
    //       }

    //       //   if (item.document.split(['.'][-1] == 'pdf')){


    //     }




    //   },
    //   error: (e) => {
    //     // Handle errors
    //     console.error(e);
    //     // Set loading to false in case of an error

    //   }
    // });
    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.userservice.getpersonalinfobyid(this.user_id).subscribe({
        next: (res) => {
          this.user_info = res

          this.user_info.carInfo.drivingLicense = baseUrl + "uploads/" + this.user_info.carInfo.drivingLicense;
          this.user_info.identificationDocument = baseUrl + "uploads/" + this.user_info.identificationDocument;
          this.user_info.ribDocument = baseUrl + "uploads/" + this.user_info.ribDocument;

          this.docs.push(
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.carInfo.drivingLicense,
              "documentName": "permis"
            },
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.identificationDocument,
              "documentName": "CNI"
            },
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.ribDocument,
              "documentName": "rib"
            }
          );
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error
        }
      });

      this.consultantservice.getMissionsofUser(this.user_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server

          this.items = res


          for (let mission of this.items) {
            if (mission.validated_by) {
              console.log(this.getvalidateby(mission.validated_by));
              this.consultantservice.getuserinfomation(mission.validated_by).subscribe({
                next: (res) => {
                  mission.validated_by = res.firstName + ' ' + res.lastName
                },
                error: (e) => {
                  // Handle errors
                  console.error(e);
                  // Set loading to false in case of an error
                }
              });

            } else {
              mission.validated_by = ''
            }
            console.log(mission);


          }





        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

  }
  paymenttype: any
  validateJobCotractEdition(type: any): void {
    const data = {
      "type": type
    }
    console.log(data);

    this.studentservice.update_paymenttype_status(data, this.preinscription_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);
        window.location.reload();
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  generatePdf() {
    // Get the data for the table
    const Sanctions = this.sanctions;

    // Generate the table rows dynamically
    const tableRows = Sanctions.map((item: any) => `
        <tr>
            <td>${item.type} </td>
            <td> ${item.motif} </td>
            <td><b>${item.date.split('T')[0]}</b></td>
        </tr>
    `).join('');


    // Create the HTML content
    const htmlContent = `
        <html>
          <head>
            <style>
              table {
                width: 90%;
                margin-top: 10px;
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
          </div> </div> <br>

          <b style='text-align:center;'> Fiche Etudiant  </b><br> <br>

          Informations personnelles
          <div style="height: auto; flex-shrink: 0">
          <div style="display: flex">
            <img src="/assets/4035887-200.png"
              style="width: 40px; border-radius: 20%; height: 45px;margin-top: 20px;" />
            <div style="margin-top: 15px; margin-left: 15px">
              <div style="
                  color: #6e7787;

                  font-size: 0.875rem;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 1.375rem; /* 157.143% */
                ">
                étudiant
              </div>
              <div style="
                  color: #171a1f;

                  font-size: 1rem;
                  font-style: normal;
                  font-weight: 300;
                  line-height: 2.25rem; /* 150% */
                ">
                ${this.personalInfo.first_name}
                ${this.personalInfo.last_name}
              </div>
            </div>


          </div>
          <br />
          <div style="display: flex">
      

          </div>
          <br />
          <div style="display: flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8.0002 10.8002C9.54659 10.8002 10.8002 9.54659 10.8002 8.0002C10.8002 6.4538 9.54659 5.2002 8.0002 5.2002C6.4538 5.2002 5.2002 6.4538 5.2002 8.0002C5.2002 9.54659 6.4538 10.8002 8.0002 10.8002Z"
                  stroke="#565E6C" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M10.4 13.5006C9.2159 14.0173 7.89661 14.1381 6.63836 13.8449C5.3801 13.5517 4.25009 12.8602 3.4164 11.8732C2.5827 10.8863 2.08985 9.65654 2.01115 8.36697C1.93244 7.07741 2.27209 5.79688 2.97958 4.71584C3.68706 3.63481 4.72459 2.81101 5.93785 2.36697C7.15111 1.92293 8.47529 1.88237 9.71345 2.25133C10.9516 2.62028 12.0376 3.37903 12.8099 4.41474C13.5823 5.45045 13.9996 6.70779 14 7.99976V9.19976C14 9.6241 13.8314 10.0311 13.5314 10.3311C13.2313 10.6312 12.8244 10.7998 12.4 10.7998C11.9757 10.7998 11.5687 10.6312 11.2686 10.3311C10.9686 10.0311 10.8 9.6241 10.8 9.19976L10.8 5.19976"
                  stroke="#565E6C" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div style="margin-left: 10px">
            ${this.user_email}
            </div>
          </div>
          <div style="display: flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10.011 9.41126L9.03337 10.6337C7.51852 9.74363 6.2562 8.48131 5.36617 6.96646L6.58857 5.98886C6.73187 5.87419 6.83314 5.71528 6.87656 5.53697C6.91998 5.35865 6.9031 5.17097 6.82857 5.00326L5.71417 2.49366C5.63425 2.31383 5.49306 2.16822 5.31577 2.0828C5.13849 1.99737 4.93662 1.97769 4.74617 2.02726L2.62457 2.57686C2.42668 2.62875 2.25466 2.75133 2.14101 2.92143C2.02736 3.09154 1.97996 3.29738 2.00777 3.50006C2.38 6.15105 3.6052 8.60879 5.49812 10.5017C7.39104 12.3946 9.84878 13.6198 12.4998 13.9921C12.7024 14.02 12.9082 13.9727 13.0782 13.859C13.2482 13.7453 13.3706 13.5732 13.4222 13.3753L13.9726 11.2545C14.0221 11.064 14.0025 10.8621 13.917 10.6849C13.8316 10.5076 13.686 10.3664 13.5062 10.2865L10.9966 9.17206C10.8289 9.09772 10.6414 9.08086 10.4631 9.12412C10.2849 9.16738 10.1259 9.26833 10.011 9.41126Z"
                  stroke="#565E6C" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div style="margin-left: 10px">
            ${this.personalInfo.phone}
            </div>
          </div>
          <div style="display: flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.3999 7.6L4.3999 2L11.5999 2V6" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M6.8 9.2002L2 9.2002L2 14.0002H6.8L6.8 9.2002Z" stroke="#565E6C" stroke-width="0.8"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.0002 7.6001L9.2002 7.6001L9.2002 14.0001H14.0002L14.0002 7.6001Z" stroke="#565E6C"
                  stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.6001 11.6001H5.2001" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M10.7998 10H12.3998" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M10.7998 11.6001H12.3998" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M6.7998 14H9.1998" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M6.7998 4.3999L9.1998 4.3999" stroke="#565E6C" stroke-width="0.8" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
            <div style="margin-left: 10px">
            ${this.personalInfo.adresse}
            </div>
          </div>

          <div style="display: flex">
            <div style="
                margin: 10px;
                color: #6e7787;

                font-size: 0.875rem;
                font-style: normal;
                font-weight: 400;
                line-height: 1.375rem; /* 157.143% */
              ">
              Classe
            </div>
            <div style="
                display: flex;
                margin-top: 7px;
                width: 3.625rem;
                height: 1.5rem;
                padding: 0.1875rem 0.5625rem 0.1875rem 0.5rem;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 0.25rem;
                background: #f3f4f6;
                margin-left: 40px;
              ">
              ${this.personalInfo.classe}
            </div>
          </div>
          <div style="display: flex">
            <div style="
                margin: 10px;
                color: #6e7787;

                font-size: 0.875rem;
                font-style: normal;
                font-weight: 400;
                line-height: 1.375rem; /* 157.143% */
              ">
              code
            </div>
            <div style="
                display: flex;
                margin-top: 7px;
                max-width: 6.625rem;
                height: 1.5rem;
                padding: 0.1875rem 0.5625rem 0.1875rem 0.5rem;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 0.25rem;

                margin-left: 38px;
              ">
              ${this.personalInfo.code}
            </div>
          </div>
          <div style="display: flex">
            <div style="
            margin: 10px;
            color: #6e7787;

            font-size: 0.875rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.375rem; /* 157.143% */
          ">CIN</div>
            <div style="
            display: flex;
            margin-top: 7px;
            max-width: 6.625rem;
            height: 1.5rem;
            padding: 0.1875rem 0.5625rem 0.1875rem 0.5rem;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 0.25rem;

            margin-left: 38px;
          ">
            ${this.personalInfo.cin}
            </div>
          </div>
          <div style="display: flex">
            <div style="
                margin: 10px;
                color: #6e7787;

                font-size: 0.875rem;
                font-style: normal;
                font-weight: 400;
                line-height: 1.375rem; /* 157.143% */
              ">
              Paiment
            </div>
            <div style="
                display: flex;
                margin-top: 7px;
                max-width: 6.625rem;
                height: 1.5rem;
                padding: 0.1875rem 0.5625rem 0.1875rem 0.5rem;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 0.25rem;

                margin-left: 38px;
              ">
              ${this.validation}
            </div>
          </div>
          <br>

          <div
            class="border-radius: 1rem; background: #F7F5EF; box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.26); width: 27.375rem; height: 43.625rem; flex-shrink: 0;">
          </div>
          <br />
        </div>


            
            Sanctions Administratives
            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">type</th>
                    <th>motif</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">date</th>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>


            Orientation
            <table>
                <thead>
                    <th style="border-radius: 0.6875rem 0rem 0rem 0rem">Choix</th>
                    <th style="border-radius: 0rem 0.6875rem 0rem 0rem">parcours</th>
                  
                </thead>
                <tbody>
                <tr>
                <td>  Choix 1 </td>
                <td>${this.data_orientation.choix1} </td>
            </tr>
            <tr>
                <td>  Choix 2 </td>
                <td>${this.data_orientation.choix2} </td>
            </tr>
            <tr>
            <td>  Choix 3 </td>
            <td>${this.data_orientation.choix3} </td>
        </tr>
        <tr>
        <td>  Choix 4 </td>
        <td>${this.data_orientation.choix4} </td>
    </tr>
                </tbody>
            </table>
          </body> <br><br>
        </html>`;

    // Generate PDF from HTML content
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'etudiants.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).pdf.save('document.pdf');
  }

  affcterstudent(event: any) {
    const selectedValue = event.target.value;
    this.studentservice.putorientation(this.student_id, selectedValue).subscribe({
      next: (res) => {


      }
    })
  }
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.validated_mission.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.validated_mission.length);


    return this.validated_mission.slice(startIndex, endIndex);



  }

  getDisplayeddocs1(): any[] {


    this.totalPages = Math.ceil(this.sanctions.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.sanctions.length);


    return this.sanctions.slice(startIndex, endIndex);


  }
  sanctions: any

  getvalidateby(user_id: any) {
    return this.consultantservice.getuserinfomation(user_id);
  }
  onTypeChange() {

    this.showPopup1 = true;

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

  nextPage14() {
    if (this.currentPage14 < this.totalPages14) {
      this.currentPage14++;
    }
  }

  previousPage14() {
    if (this.currentPage14 > 1) {
      this.currentPage14--;
    }
  }
  nextPage15() {
    if (this.currentPage15 < this.totalPages15) {
      this.currentPage15++;
    }
  }

  previousPage15() {
    if (this.currentPage15 > 1) {
      this.currentPage15--;
    }
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  sendmail(email: any) {
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
          "email": email,
          "subject": formData1.subject,
          "message": formData1.message
        };
        this.consultantservice.sendemailconsultant(data).subscribe({
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
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/mission/' + _id])
  }
  addvirement() {
    this.router.navigate([clientName + 'virements/' + this.user_id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  openPopup1(): void {
    this.showPopup1 = true;
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/students/' + _id])
  }
  openPopup3(): void {
    this.showPopup3 = true;
  }
  selectedDate: any;
  // applyFiltercra() {
  //   // Check if search term is empty
  //   if (this.searchTerm.trim() === ' ') {
  //     // If search term is empty, reset the filtered items to the original items
  //     this.docs = this.docs;
  //     console.log("docsssss" + this.docs);

  //   } else {
  //     // Apply filter based on search term
  //     this.docs = this.docs.filter((item: any) =>
  //       item.filename.split('uploads/')[1].toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //     console.log("docseeeessss" + this.docs);
  //   }
  // }

  filterByUploadDate(uploadDate: Date): boolean {
    if (!this.selectedDate) {
      this.showfilter = true
      return true; // No filter applied
    }
    else {
      this.showfilter = false
      // Format the uploadDate to match selectedDate format
      const formattedUploadMonth = this.datePipe.transform(uploadDate || '', 'yyyy-MM');
      const formattedSelectedMonth = this.datePipe.transform(this.selectedDate || '', 'yyyy-MM');

      // Check if the formatted months match
      return formattedUploadMonth === formattedSelectedMonth;
    }

  }
  applyFilter() {
    // Check if search term is empty


    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.docs;
    } else {


      // Apply filter based on search term
      this.filteredItems = this.docs.filter((item: any) =>
        item.documentName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log(this.filteredItems);
    }
  }
  applyFilter1() {
    // Check if search term is empty


    if (this.searchTerm1.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.allcra = this.allcra.craPdfs
    } else {


      // Apply filter based on search term
      this.allcra = this.allcra.filter((item: any) =>
        item.client.toLowerCase().includes(this.searchTerm1.toLowerCase())
      );

    }
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  closePopup3(): void {
    this.showPopup3 = false;

  }
  show_cra: boolean = false
  showdocs() {
    this.show_doc = true
    this.show_mission = false
    this.show_cra = false
    this.show_historique = false
    this.orientation = false
  }

  showhistorique() {
    this.show_historique = true
    this.show_doc = false
    this.show_mission = false
    this.show_cra = false
    this.orientation = false
  }

  showcras() {
    this.show_doc = false
    this.show_mission = false
    this.show_cra = true
    this.show_historique = false
    this.orientation = false
  }

  showmidssions() {
    this.show_doc = false
    this.show_mission = true
    this.show_cra = false
    this.show_historique = false
    this.orientation = false
  }
  orientation: any
  showorientation() {
    this.show_doc = false
    this.show_mission = false
    this.show_cra = false
    this.show_historique = false
    this.orientation = true
  }
  gotocra(_id: string) {
    this.router.navigate([clientName + '/cra-mission/' + _id])
  }

  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);

    this.consultantservice.validatePriseDeContact(id, data, this.headers).subscribe({
      next: (res) => {
        console.log(res);

        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }
    this.consultantservice.validateClientValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

  validateContractValidation(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    this.consultantservice.validateContractValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  as_prete(id: any) {
    this.studentservice.update_new_status_demande(id).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

  }
  gotovalidemission(mission_id: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + mission_id])
  }
  idpdf: any
  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'document') {
          this.document = e.target!.result as string;
          const formData = new FormData();
          const document = this.fileInputs.document.files[0];

          console.log(document);

          // Append the files if they exist, else append empty strings
          formData.append('document', document);
          if (document.name.endsWith('.pdf')) {
            this.idpdf = true
          }
          console.log(formData);
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    const token = localStorage.getItem('token');

    if (token && this.selectedFile) {
      console.log(this.myForm.value.documentName);

      const formData = new FormData();
      formData.append('userDocument', this.selectedFile);
      formData.append('documentName', this.myForm.value.documentName);

      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.addDocumentToUser(this.user_id, formData, headers)
        .subscribe({
          next: (res) => {

            Swal.fire({

              background: 'white',
              confirmButtonText: 'Ok',

              confirmButtonColor: "rgb(0, 17, 255)",
              title: 'Document ajouté avec succès!',
              showConfirmButton: false,
              timer: 3000 // Adjusted timer to 3000 milliseconds (3 seconds)
            });
            // Hide the popup after 3 seconds
            setTimeout(() => {
              this.showPopup = false;
              // Reload the page after hiding the popup
              window.location.reload();
            }, 1000);
            // Handle the response from the server
          },
          error: (e) => {
            // Handle errors
            console.error(e);
          }
        });
    }
  }

  downloadFile(urlpdf: any, filename: any) {

    this.consultantservice.downloadpdffile(urlpdf, filename)

  }

  onFormSubmit() {

    Swal.fire({
      title: 'Confirmer l"action',
      html: `
        <div>
          <div style="font-size:1.2rem;">Êtes-vous sûr de vouloir effectuer cet action ?</div> 
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

        this.showPopup1 = false
        this.myForm.value.user_id = this.student_id
        this.studentservice.new_sancttion(this.foremData.value, this.student_id).subscribe({
          next: (res) => {
            console.log(res);
            window.location.reload()
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            // Set loading to false in case of an error
          }
        });

      } else {
        Swal.fire({
          background: 'white',
          title: 'Virement annulé',
          text: 'Aucun virement n\'a été effectué.',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#91c593',
        });
      }
    });
  }

  // Dans votre composant TypeScript
  downloadDocument(documentUrl: string, documentName: string): void {
    console.log(documentName, documentUrl);

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

  getDisplayeddocs14(): any[] {


    this.totalPages14 = Math.ceil(this.res14.length / this.pageSize14);
    const startIndex = (this.currentPage14 - 1) * this.pageSize14;
    const endIndex = Math.min(startIndex + this.pageSize14, this.res14.length);


    return this.res14.slice(startIndex, endIndex);
  }
}
