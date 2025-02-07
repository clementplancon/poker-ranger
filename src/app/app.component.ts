import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Poker Ranger';
  authService = inject(AuthService);

  constructor() {
    console.log(`Running version ${environment.version}`);
    if (localStorage.getItem('version') !== environment.version) {
      localStorage.clear();
      localStorage.setItem('version', environment.version);
      window.location.reload();
    }
  }

  login() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.authService.logout();
  }
}
