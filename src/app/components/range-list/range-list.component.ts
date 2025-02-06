import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RangeService, PokerRange } from '../../services/range.service';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-range-list',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './range-list.component.html',
  styleUrls: ['./range-list.component.scss']
})
export class RangeListComponent {
  private router = inject(Router);
  private rangeService = inject(RangeService);

  // Observable contenant la liste des ranges de l'utilisateur
  ranges$ = this.rangeService.getUserRanges();

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
}
