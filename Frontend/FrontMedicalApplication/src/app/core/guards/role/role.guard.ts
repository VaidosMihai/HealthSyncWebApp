import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';

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
    const currentUserRole = this.authService.getCurrentUserRole();

    if (currentUserRole !== null && requiredRoles.includes(currentUserRole)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
