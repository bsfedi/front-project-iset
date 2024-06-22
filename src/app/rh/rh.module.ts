import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { ValidationComponent } from './validation/validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from '../auth/auth.module';
import { ConsultantMissionComponent } from './consultant-mission/consultant-mission.component';

import { allStudentsComponent } from './all-consultants/all-consultants.component';
import { ValidationMissionComponent } from './validation-mission/validation-mission.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { LeftBarComponent } from '../layout/left-bar/left-bar.component';

import { NotificaionRhComponent } from './notificaion-rh/notificaion-rh.component';
import { ChargeDocComponent } from './charge-doc/charge-doc.component';

import { tjmrequestsComponent } from './tjmrequests/tjmrequests.component';

import { AdminComponent } from './admin/admin.component';

import { EnseignantComponent } from './enseignant/enseignant.component';
import { DemandeRattrapageComponent } from './demande-rattrapage/demande-rattrapage.component';
import { AbsenceComponent } from './absence/absence.component';
import { SuivreDemandeComponent } from './suivre-demande/suivre-demande.component';
import { DemandesEnsrignantComponent } from './demandes-ensrignant/demandes-ensrignant.component';
import { GererDepartementComponent } from './gerer-departement/gerer-departement.component';
import { GererSallesComponent } from './gerer-salles/gerer-salles.component';
import { GestionStagesComponent } from './gestion-stages/gestion-stages.component';
import { DetailsStageComponent } from './details-stage/details-stage.component';
import { GestionAbsencesComponent } from './gestion-absences/gestion-absences.component';
import { GestionOrientationComponent } from './gestion-orientation/gestion-orientation.component';
import { SupportCoursComponent } from './support-cours/support-cours.component';
import { FicheDesVoeuxComponent } from './fiche-des-voeux/fiche-des-voeux.component';
import { SecretaireComponent } from './secretaire/secretaire.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },

  {
    path: 'dashboard',
    component: DashboardComponent,

  },
  {
    path: 'gestion-stage',
    component: GestionStagesComponent,

  },
  {
    path: 'allStudents',
    component: allStudentsComponent,

  },
  {
    path: 'validation/:id',
    component: ValidationComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'students/:id',
    component: ConsultantMissionComponent,
  },
  {
    path: 'details-stage/:id',
    component: DetailsStageComponent,
  },
  {
    path: 'enseignant',
    component: EnseignantComponent
  },
  {
    path: 'validationmission/:id_mission',
    component: ValidationMissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'charge-document',
    component: ChargeDocComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'demanderattrapage',
    component: DemandeRattrapageComponent

  },
  {
    path: 'gestionabsences',
    component: GestionAbsencesComponent

  },
  {
    path: 'gestion-orientation',
    component: GestionOrientationComponent
  },
  {
    path: 'secretaire',
    component: SecretaireComponent
  },
  {
    path: 'fiche_des_voeux',
    component: FicheDesVoeuxComponent
  },
  {

    path: 'support-cours',
    component: SupportCoursComponent
  },

  {
    path: 'salles-rattrapge',
    component: GererSallesComponent

  },
  {
    path: 'suivirattrapage',
    component: SuivreDemandeComponent
  },
  {
    path: 'absence',
    component: AbsenceComponent

  },
  {
    path: 'demandes',
    component: DemandesEnsrignantComponent

  },
  {
    path: 'gestion',
    component: GererDepartementComponent
  },

  {
    path: 'gestionadministrative',
    component: tjmrequestsComponent,

  },


  {
    path: 'members',
    component: AdminComponent,

  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    ValidationComponent,
    ConsultantMissionComponent,

    allStudentsComponent,
    ValidationMissionComponent,
    NotificaionRhComponent,
    ChargeDocComponent,

    tjmrequestsComponent,

    AdminComponent,
    EnseignantComponent,
    DemandeRattrapageComponent,
    AbsenceComponent,
    SuivreDemandeComponent,
    DemandesEnsrignantComponent,
    GererDepartementComponent,
    GererSallesComponent,
    GestionStagesComponent,
    DetailsStageComponent,
    GestionAbsencesComponent,
    GestionOrientationComponent,
    SupportCoursComponent,
    FicheDesVoeuxComponent,
    SecretaireComponent,
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,// Add FormsModule here
    LeftBarComponent,

  ],
})
export class RHModule { }
