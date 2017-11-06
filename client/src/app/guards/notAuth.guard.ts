import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }



  canActivate() {
    if (!this.authService.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
