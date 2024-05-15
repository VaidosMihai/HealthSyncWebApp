import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs'; // Import throwError
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user.dto';

export interface LoginResponse {
  token: string;
  email: string;
  user: UserDto;
  roleId: number;
  isLogged: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserDto | null>;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public currentUser: Observable<UserDto | null>;

  constructor(private http: HttpClient) {
    const currentUserFromStorage = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserDto | null>(currentUserFromStorage ? JSON.parse(currentUserFromStorage) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', email);

        this.getUserDataByEmail(email).subscribe(
          (users: UserDto[]) => {
            const user = users.find(u => u.emailAddress === email);
            if (user) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              localStorage.setItem('roleId', JSON.stringify(user.roleId));
              localStorage.setItem('isLogged', JSON.stringify(true));
              this.currentUserSubject.next(user);
              this.isLoggedInSubject.next(true); // Emit login status
            } else {
              console.error('User not found.');
            }
          },
          (error) => {
            console.error('Failed to load user data:', error);
          }
        );
      })
    );
  }

  public getUserDataByEmail(email: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/user?email=${email}`);
  }

  public requestResetCode(phoneNumber: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/password-reset/request-code`, { phoneNumber }).pipe(
      catchError(this.handleError)
    );
  }

  public resetPassword(phoneNumber: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reset-password/sms`, { phoneNumber, code, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

  public signUp(username: string, email: string, password: string, confirmPassword: string, name: string, surname: string, CNP: string, age: number, roleId: number, Address: string, PhoneNumber: string): Observable<UserDto> {
    const body = { username, email, password, confirmPassword, name, surname, CNP, age, roleId, Address, PhoneNumber };
    return this.http.post<UserDto>(`${environment.apiUrl}/auth/register`, body).pipe(
      catchError(this.handleError)
    );
  }

  public getCurrentUserRole(): number | null {
    const roleId = localStorage.getItem('roleId');
    return roleId ? parseInt(roleId, 10) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('roleId');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error); // Use throwError
  }
}
