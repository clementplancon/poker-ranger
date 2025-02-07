import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import {
  MoveDirection,
  OutMode,
  Container,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

@Component({
  selector: 'app-login',
  imports: [NgxParticlesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  id = "tsparticles";

  constructor(
    private readonly ngParticlesService: NgParticlesService
  ) {}

  ngOnInit() {
    // Dès qu'un utilisateur est authentifié, rediriger vers l'écran d'accueil.
    const subscriction = this.authService.user$.subscribe(user => {
      if (user) {
        subscriction.unsubscribe();
        this.router.navigate(['/']);
      }
    });

    this.ngParticlesService.init(async (engine) => {
      console.log(engine);

      // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadFull(engine);
      await loadSlim(engine);
    });
  }

  login() {
    this.authService.loginWithGoogle();
  }
  
  particlesLoaded(container: Container): void {
    console.log(container);
  }

  particlesOptions = {
    fpsLimit: 120,
    particles: {
      color: {
        value: "#c3ef61",
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: true,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 60,
      },
      opacity: {
        value: 0.7,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 10, max: 30 },
      },
    },
    detectRetina: true,
  };
}
