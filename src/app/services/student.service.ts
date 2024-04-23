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

  getuserbyid(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'user/' + user_id);
  }
  getpreregisterbyid(user_id: any): Observable<any> {
    return this.http.get(baseUrl + 'get_preregister/' + user_id);
  }

  newuser(data: any): Observable<any> {

    return this.http.post(baseUrl + 'auth/newuser', data);
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
  update_status_demande(data: any, demande_id: any, enseignant: any): Observable<any> {

    return this.http.put(baseUrl + 'update_status_demande/' + demande_id + "/" + enseignant, data);
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

  getdemandeverification(user_id: any): Observable<any> {

    return this.http.get(baseUrl + 'verification/' + user_id);
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
