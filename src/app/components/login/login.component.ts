import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Dès qu'un utilisateur est authentifié, rediriger vers l'écran d'accueil.
    const subscriction = this.authService.user$.subscribe(user => {
      if (user) {
        subscriction.unsubscribe();
        this.router.navigate(['/']);
      }
    });
  }

  login() {
    this.authService.loginWithGoogle();
  }
}
