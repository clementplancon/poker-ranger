import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RangeService, PokerRange } from '../../services/range.service';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import {
  MoveDirection,
  OutMode,
  Container,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

@Component({
  selector: 'app-range-list',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, NgxParticlesModule],
  templateUrl: './range-list.component.html',
  styleUrls: ['./range-list.component.scss']
})
export class RangeListComponent implements OnInit {
  private router = inject(Router);
  private rangeService = inject(RangeService);
    id = "tsparticles";
  
    constructor(
      private readonly ngParticlesService: NgParticlesService
    ) {}

  // Observable contenant la liste des ranges de l'utilisateur
  ranges$ = this.rangeService.getUserRanges();

  ngOnInit(): void {
        this.ngParticlesService.init(async (engine) => {
          console.log(engine);
    
          // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
          // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
          // starting from v2 you can add only the features you need reducing the bundle size
          //await loadFull(engine);
          await loadSlim(engine);
        });
  }

  // Retour à l'écran d'accueil
  goHome() {
    this.router.navigate(['/']);
  }

  // Navigation vers l'écran d'édition d'une range
  editRange(range: PokerRange) {
    this.router.navigate(['/range', range.id]);
  }

  // Navigation vers l'écran de création d'une nouvelle range
  addRange() {
    this.router.navigate(['/range', 'new']);
  }

  // Méthode pour supprimer une range après confirmation
  deleteRange(range: PokerRange, event: Event) {
    // Empêche la propagation pour éviter d'activer editRange
    event.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cette range ?")) {
      this.rangeService.deleteRange(range.id!).then(() => {
        alert("Range supprimée avec succès !");
        // Mise à jour de la liste des ranges
        this.ranges$ = this.rangeService.getUserRanges();
      }).catch(err => {
        console.error(err);
        alert("Erreur lors de la suppression de la range.");
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
