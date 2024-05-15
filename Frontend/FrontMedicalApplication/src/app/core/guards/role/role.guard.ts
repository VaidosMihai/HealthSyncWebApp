// In your guard file or a separate model file
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';   // Correct the import path as necessary

interface RouteRoleData {
  roles: number[];
}

@Injectable({
  providedIn: 'root'
})
export class roleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const requiredRoles = (next.data as RouteRoleData).roles;
    const currentUserRole = this.authService.getCurrentUserRole();  // Now returns number or null

    if (currentUserRole !== null && requiredRoles.includes(currentUserRole)) {
      return true;
    } else {
      this.router.navigate(['/login']);  // Redirect to login if role is null or not in requiredRoles
      return false;
    }
  }
}
