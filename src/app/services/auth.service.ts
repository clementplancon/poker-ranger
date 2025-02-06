import { Injectable, NgZone, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private zone = inject(NgZone);
    // On initialise avec null pour indiquer qu'aucun utilisateur n'est encore authentifié
    user$ = new BehaviorSubject<User | null>(null);
  
    constructor(private auth: Auth) {
      onAuthStateChanged(this.auth, (user) => {
        this.user$.next(user);
      });
    }
  
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      // Enveloppe l'appel Firebase dans NgZone.run
      return this.zone.run(() => signInWithPopup(this.auth, provider));
    }

  // Déconnexion
  async logout() {
    await signOut(this.auth);
  }
}
