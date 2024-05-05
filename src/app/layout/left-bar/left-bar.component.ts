import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this line
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { StudentService } from 'src/app/services/student.service';
const clientName = `${environment.default}`;
@Component({
  standalone: true,
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css'],
  imports: [CommonModule]
})

export class LeftBarComponent {
  level: any
  constructor(private router: Router, private route: ActivatedRoute, private studentservice: StudentService) {
    document.addEventListener("DOMContentLoaded", function () {


      const menuToggle = document.querySelector(".menu-toggle") as HTMLElement;
      const firstItem = document.querySelector(".first-item") as HTMLElement;



    });

    this.role = localStorage.getItem('role');
    if (this.role == 'student') {
      this.studentservice.getinscrption(localStorage.getItem('register_id')).subscribe({
        next: (res) => {
          this.level = res.preregister.personalInfo.level
        }, error(e) {
          console.log(e);

        }
      });
    } else {
      this.studentservice.getuserbyid(localStorage.getItem('user_id')).subscribe({
        next: (res) => {
          this.level = res.first_name + " " + res.last_name
        }, error(e) {
          console.log(e);

        }
      });
    }

  }
  isActiveRoute(route: string): boolean {
    return this.route.snapshot.url.join('/') === route;
  }
  rat: boolean = false;
  showPopup: boolean = false
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;
  }
  showrattrapgeoption() {
    this.rat = !this.rat; // Toggle the value of rat
  }


  azeaze() {
    const menuToggle = document.querySelector(".menu-toggle") as HTMLElement;
    const firstItem = document.querySelector(".first-item") as HTMLElement;

    console.log(menuToggle);
    if (menuToggle) {

      // Toggle the class to show/hide the navigation bar
      firstItem.classList.toggle("collapsed");

      // Adjust the margin-left of the first item
      if (firstItem.classList.contains("collapsed")) {
        firstItem.style.marginLeft = "-30px";

      } else {
        firstItem.style.marginLeft = "-270px";

      }

    }
  }
  gotoenseignant() {
    this.router.navigate([clientName + '/enseignant'])
  }
  gotogestion() {
    this.router.navigate([clientName + '/gestion'])
  }
  gotosallesrattrapge() {
    this.router.navigate([clientName + '/salles-rattrapge'])

  }
  gotosatge() {
    this.router.navigate([clientName + '/gestion-stage'])
    // Toggle the value of rat
  }

  gottodashboard() {
    this.router.navigate([clientName + '/dashboard'])
  }
  gotomission() {
    this.router.navigate([clientName + '/student/requests'])

  }

  gotoorientation() {
    this.router.navigate([clientName + '/student/orientation'])

  }
  gotovirment() {
    this.router.navigate([clientName + '/student/inscriptions'])

  }
  demanderattrapage() {
    this.router.navigate([clientName + '/demanderattrapage'])

  }
  suivirattrapage() {
    this.router.navigate([clientName + '/suivirattrapage'])

  }

  absence() {
    this.router.navigate([clientName + '/absence'])

  }


  gottoallcras() {
    this.router.navigate([clientName + '/allcras'])
  }
  goinfopersot() {
    this.router.navigate([clientName + '/consultant/infoperso'])
  }
  gomyprofil() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  goallStudents() {
    this.router.navigate([clientName + '/allStudents'])

  }
  gotogestionadministrative() {
    this.router.navigate([clientName + '/gestionadministrative'])

  }
  gestionorientation() {
    this.router.navigate([clientName + '/gestion-orientation'])

  }

  absences() {
    this.router.navigate([clientName + '/absences'])

  }
  gotogestioabsences() {
    this.router.navigate([clientName + '/gestionabsences'])
  }
  gotstudentstages() {
    this.router.navigate([clientName + '/student/stages'])

  }
  gotomembres() {
    this.router.navigate([clientName + '/members'])

  }
  gotodemandes() {
    this.router.navigate([clientName + '/demandes'])

  }
  role: any
  showmenu_consultant = false
  show_student = false
  currentDate: any;
  res: any
  ngOnInit(): void {
    this.role = localStorage.getItem('role')
    const user_id = localStorage.getItem('user_id')
    // if (this.role == 'CONSULTANT') {
    //   this.showmenu_consultant = true


    // }
    if (this.role == 'student') {
      this.showmenu_consultant = true


    }
    this.studentservice.getuserbyid(user_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res


      },
      error: (e) => {
        // Handle errors
        console.error(e);
      }
    });
  }
  clearLocalStorage() {
    Swal.fire({
      title: 'Confirmer les modifications',
      html: `
        <div>
        <div style="font-size:1.2rem;">  Êtes-vous sûr de vouloir <br>déconnecter de ce compte ? </div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      background: 'white',
      showCancelButton: true,
      confirmButtonText: 'Oui',
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

        localStorage.clear();
        this.router.navigate([clientName + '/sign-in'])
        // User clicked 'Yes', call the endpoint

      }
    });

    this.currentDate = new Date();
    console.log(this.currentDate);
    this.isMonthInRange()
  }
  showinsc: any
  isMonthInRange() {
    // Get the current month (0-indexed)
    const currentMonth = this.currentDate.getMonth();
    console.log(currentMonth >= 7 && currentMonth <= 9);
    if (currentMonth >= 7 && currentMonth <= 9) {
      this.showinsc = true
      console.log(this.showinsc);


    }
    // Check if the current month is within the specified range
    // 7, 8, 9 corresponds to August, September, October


  }
}

