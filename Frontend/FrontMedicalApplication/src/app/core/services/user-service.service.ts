import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user.dto';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  setCurrentUser(user: UserDto): void {
    this.currentUserSubject.next(user);
  }

  getPatientById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, patient);
  }

  updatePatient(userId: number, patient: UserDto): Observable<UserDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getStoredToken()}`
    });
    
    return this.http.put<UserDto>(`${this.apiUrl}/${userId}`, patient, { headers });
  }
  
  private getStoredToken(): string {
    return localStorage.getItem('token') || ''; // Or however you handle token retrieval
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}`);
  }

  getAllUsersWithRoleId(roleId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}?roleId=${roleId}`);
  }

  getUsersByRole(roleId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}`).pipe(
      map(users => users.filter(user => user.roleId === roleId)),
      catchError(error => {
        // handle error
        throw error;
      })
    );
  }
  getUserDataByEmail(email: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/email/${email}`);
  }
  
  getAllPatients(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}`);
  }

  getUserByUsername(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/by-username/${username}`);
  }
  
  getUserById(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${userId}`);
  }
  
  getNotificationCount(doctorId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notifications/count/${doctorId}`);
  }

  getNotifications(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/${doctorId}`);
  }
}