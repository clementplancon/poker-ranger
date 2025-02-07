import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import {
  MoveDirection,
  OutMode,
  Container,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

@Component({
  selector: 'app-home',
  imports: [NgxParticlesModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  deferredPrompt: any;
    id = "tsparticles";
  
    constructor(
      private readonly ngParticlesService: NgParticlesService
    ) {}

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Empêcher l'affichage du mini-infobar par défaut
      e.preventDefault();
      // Sauvegarder l'événement pour l'afficher plus tard
      this.deferredPrompt = e;
      // Vous pouvez maintenant afficher votre bouton personnalisé d'installation
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

  goToRanges() {
    this.router.navigate(['/range']);
  }

  goToQuiz() {
    //this.router.navigate(['/quiz']);
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('L\'utilisateur a installé la PWA.');
        } else {
          console.log('L\'utilisateur a refusé l\'installation.');
        }
        this.deferredPrompt = null;
      });
    }
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
