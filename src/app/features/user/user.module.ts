import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PendingPreinscriptionComponent } from './pending-preinscription/pending-preinscription.component';


import { NgApexchartsModule } from "ng-apexcharts";



import { InscriptionsComponent } from './inscriptions/inscriptions.component';

import { LeftBarComponent } from 'src/app/layout/left-bar/left-bar.component';

import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { EditProfilComponent } from 'src/app/features/user/edit-profil/edit-profil.component';
import { StagesComponent } from './stages/stages.component';
import { OrientationComponent } from './orientation/orientation.component';
import { AbsencesComponent } from './absences/absences.component';
import { StudentDemandesComponent } from './student-demandes/student-demandes.component';


export const routes: Routes = [
  {
    path: 'pending',
    component: PendingPreinscriptionComponent,
  },
  {
    path: 'student/orientation',
    component: OrientationComponent
  },

  {
    path: 'student/stages',
    component: StagesComponent,

  },

  {
    path: 'student/requests',
    component: StudentDemandesComponent,

  },

  {
    path: 'student/inscriptions',
    component: InscriptionsComponent,

  },

  {
    path: "mot-de-passe-oublier",
    component: ForgetPasswordComponent
  },
  {
    path: "change-mot-de-passe/:user_id",
    component: UpdatePasswordComponent
  },

  {
    path: 'absences',
    component: AbsencesComponent
  },
  {
    path: 'edit-profil',
    component: EditProfilComponent
  }


];

@NgModule({
  declarations: [

    PendingPreinscriptionComponent,

    StudentDemandesComponent,

    InscriptionsComponent,



    ForgetPasswordComponent,
    EditProfilComponent,
    UpdatePasswordComponent,
    StagesComponent,
    OrientationComponent,
    AbsencesComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    LeftBarComponent,


  ]
})
export class AuthModule { }
