import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl + 'auth/signup', data);
  }

  login(data: any): Observable<any> {
    console.log(baseUrl);

    return this.http.post(baseUrl + 'auth/login', data);
  }
  createinscrption(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'personalInfo/' + register_id, data);
  }
  accept_note(register_id: any): Observable<any> {

    return this.http.get(baseUrl + 'accept_note/' + register_id);
  }

  createfilesinscrption(data: any, register_id: any): Observable<any> {

    return this.http.post(baseUrl + 'docs/' + register_id, data);
  }

  addnote1(data: any, register_id: any): Observable<any> {

    return this.http.post(baseUrl + 'new_docs_1/' + register_id, data);
  }
  addnote2(data: any, register_id: any): Observable<any> {

    return this.http.post(baseUrl + 'new_docs_2/' + register_id, data);
  }


  createfamilyinfo(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'student_family/' + register_id, data);
  }

  getinscrption(register_id: any): Observable<any> {
    return this.http.get(baseUrl + 'preregister/' + register_id);
  }
  get_absence_by_enseignant_id(enseignant_id: any): Observable<any> {
    return this.http.get(baseUrl + 'get_absence_by_enseignant_id/' + enseignant_id);
  }

  add_rattrapage(data: any, enseignant_id: any): Observable<any> {

    return this.http.post(baseUrl + 'add_rattrapage/' + enseignant_id, data);
  }
  rattrapage(enseignant_id: any): Observable<any> {

    return this.http.get(baseUrl + 'rattrapage/' + enseignant_id);
  }
  rattrapage_by_department(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'rattrapage_by_department/' + user_id);
  }
  update_rattrapage(rattrapage_id: any, data: any): Observable<any> {
    return this.http.put(baseUrl + 'rattrapage/' + rattrapage_id, data);
  }
  sancttions(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'sancttion/' + user_id);
  }


  getuserbyid(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'user/' + user_id);
  }
  getpreregisterbyid(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'get_preregister/' + user_id);
  }

  newuser(data: any): Observable<any> {

    return this.http.post(baseUrl + 'auth/newuser', data);
  }
  new_sancttion(data: any, user_id: any): Observable<any> {

    return this.http.post(baseUrl + 'sancttion/' + user_id, data);
  }
  stats_enseignant(enseignant_id: any): Observable<any> {

    return this.http.get(baseUrl + 'stats_enseignant/' + enseignant_id, enseignant_id);
  }

  stats_student(student_id: any): Observable<any> {

    return this.http.get(baseUrl + 'stats_student/' + student_id);
  }
  get_stages(student_id: any): Observable<any> {

    return this.http.get(baseUrl + 'get_stages/' + student_id);
  }



  getallusers(): Observable<any> {
    return this.http.get(baseUrl + 'users');
  }

  upload_users(data: any, type: any): Observable<any> {

    return this.http.post(baseUrl + 'upload_users/' + type, data);
  }
  getdemadndesenseignant(enseignant_id: any): Observable<any> {

    return this.http.get(baseUrl + 'attestation_by_enseignant/' + enseignant_id);
  }
  getverification_by_enseignant(enseignant_id: any): Observable<any> {

    return this.http.get(baseUrl + 'verification_by_enseignant/' + enseignant_id);
  }

  update_status_demande(data: any, demande_id: any, enseignant: any): Observable<any> {

    return this.http.put(baseUrl + 'update_status_demande/' + demande_id + "/" + enseignant, data);
  }
  justif(data: any, note: any, demande_id: any) {
    return this.http.put(baseUrl + 'justif/' + note + "/" + demande_id, data);

  }
  add_absence(data: any, enseignant_id: any) {
    return this.http.post(baseUrl + 'add_absence/' + enseignant_id, data);

  }

  update_status_demande_bychef(demande_id: any): Observable<any> {

    return this.http.get(baseUrl + 'update_status_demande_bychef/' + demande_id);
  }
  notvalidate_verification(demande_id: any): Observable<any> {

    return this.http.get(baseUrl + 'notvalidate_verification/' + demande_id);
  }


  enseignantsbydepartement(departement: any): Observable<any> {

    return this.http.get(baseUrl + 'enseignants/' + departement);
  }

  deleteuser(user_id: any): Observable<any> {
    return this.http.delete(baseUrl + 'user/' + user_id);

  }

  getpendingregister() {
    return this.http.get(baseUrl + 'preregister');
  }
  rhvalidation(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'preregister/' + register_id, data);
  }
  update_register(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'update_register/' + register_id, data);
  }

  attribut_role(user_id: any, privilege: any): Observable<any> {

    return this.http.get(baseUrl + 'add_privilege/' + user_id + "/" + privilege);
  }


  update_paiemnt_status(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'update_paiemnt_status/' + register_id, data);
  }

  update_depot_status(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'update_depot_status/' + register_id, data);
  }
  update_paymenttype_status(data: any, register_id: any): Observable<any> {

    return this.http.put(baseUrl + 'update_paymenttype_status/' + register_id, data);
  }

  demandeattestation(data: any): Observable<any> {

    return this.http.post(baseUrl + 'attestation', data);
  }
  demandeverification(data: any): Observable<any> {

    return this.http.post(baseUrl + 'verification', data);
  }
  enseignant_demande(data: any): Observable<any> {

    return this.http.post(baseUrl + 'enseignant_demande', data);
  }

  add_module(data: any): Observable<any> {

    return this.http.post(baseUrl + 'add_module', data);
  }

  add_classe(data: any): Observable<any> {

    return this.http.post(baseUrl + 'add_classe', data);
  }

  add_parcours(data: any): Observable<any> {

    return this.http.post(baseUrl + 'add_parcours', data);
  }


  addstage(data: any): Observable<any> {

    return this.http.post(baseUrl + 'add_stage', data);
  }
  deleteparcour(parcours_id: any) {
    return this.http.delete(baseUrl + 'delete_parcours/' + parcours_id);
  }
  deleteclasse(classe_id: any) {
    return this.http.delete(baseUrl + 'delete_classes/' + classe_id);
  }
  deletemodule(module_id: any) {
    return this.http.delete(baseUrl + 'delete_modules/' + module_id);
  }
  stats_tuitionofficer(): Observable<any> {

    return this.http.get(baseUrl + 'stats_tuitionofficer');
  }


  getdemandeverification(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'verification/' + user_id);
  }
  enseignants_demande(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'enseignants_demande/' + user_id);
  }

  getdemandeallverification(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'verification_by_department/' + user_id);
  }
  getdemandeallpresence(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'presence_by_department/' + user_id);
  }
  get_parcours(): Observable<any> {

    return this.http.get(baseUrl + 'get_parcours');
  }

  get_classes(): Observable<any> {

    return this.http.get(baseUrl + 'get_classes');
  }
  get_modules(): Observable<any> {

    return this.http.get(baseUrl + 'get_modules');
  }

  affecter_damande(demande_id: any, enseignant_id: any): Observable<any> {

    return this.http.get(baseUrl + 'affecter_damande/' + demande_id + '/' + enseignant_id);
  }

  getdemandeattestation(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'attestation/' + user_id);
  }

  validated_attestation(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'validated_attestation/' + user_id);
  }
  update_new_status_demande(demande_id: any): Observable<any> {

    return this.http.get(baseUrl + 'update_new_status_demande/' + demande_id);
  }

  validated_preregister(): Observable<any> {

    return this.http.get(baseUrl + 'validated_preregister');
  }

}
