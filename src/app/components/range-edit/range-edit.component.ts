import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action, Hand, PokerRange, Position, StackDepth, RangeService } from '../../services/range.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-range-edit',
  imports: [ReactiveFormsModule, CommonModule, NgFor],
  templateUrl: './range-edit.component.html',
  styleUrl: './range-edit.component.scss'
})
export class RangeEditComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rangeService = inject(RangeService);
  private fb = inject(FormBuilder);

  // Mode édition ou ajout
  isEditMode: boolean = false;
  rangeId: string | null = null;

  // Formulaire pour le nom, la profondeur de stack et les positions
  rangeForm: FormGroup;

  // Indicateur de modifications non sauvegardées
  hasChanges: boolean = false;

  // Liste de toutes les positions possibles
  allPositions = Object.values(Position);

  // Liste des actions disponibles
  allActions = Object.values(Action);

  // Liste des stack depth disponibles (enum)
  allStackDepths = Object.values(StackDepth);

  // Action actuellement sélectionnée (depuis la colonne de droite)
  selectedAction: Action | null = null;

  // Liste des mains sous forme d'un tableau plat (à convertir en grille)
  hands: Hand[] = [];

  // Nombre de colonnes dans la grille (13)
  gridColumns: number = 13;

  constructor() {
    this.rangeForm = this.fb.group({
      name: ['', Validators.required],
      stackDepth: ['', Validators.required],
      positions: [[], Validators.required]
    });
  }

  ngOnInit() {
    // Déterminer le mode via le paramètre de route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        // Mode édition : récupérer la range existante
        this.isEditMode = true;
        this.rangeId = id;
        this.rangeService.getRangeById(id).then(range => {
          this.rangeForm.patchValue({
            name: range.name,
            stackDepth: range.stackDepth,
            positions: range.positions
          }, { emitEvent: false });
          // On suppose que range.hands est déjà un tableau plat
          this.hands = range.hands.map(item => ({
            id: item.id,
            name: item.name,
            action: item.action
          }));
          // Après chargement, on s'assure que hasChanges est false
          this.hasChanges = false;
        }).catch(err => {
          console.error("Erreur lors de la récupération de la range :", err);
        });
      } else {
        // Mode ajout : initialiser la grille avec toutes les mains à "Fold"
        this.isEditMode = false;
        const gridData: string[][] = [
          ["AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s"],
          ["AKo","KK","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","K4s","K3s","K2s"],
          ["AQo","KQo","QQ","QJs","QTs","Q9s","Q8s","Q7s","Q6s","Q5s","Q4s","Q3s","Q2s"],
          ["AJo","KJo","QJo","JJ","JTs","J9s","J8s","J7s","J6s","J5s","J4s","J3s","J2s"],
          ["ATo","KTo","QTo","JTo","TT","T9s","T8s","T7s","T6s","T5s","T4s","T3s","T2s"],
          ["A9o","K9o","Q9o","J9o","T9o","99","98s","97s","96s","95s","94s","93s","92s"],
          ["A8o","K8o","Q8o","J8o","T8o","98o","88","87s","86s","85s","84s","83s","82s"],
          ["A7o","K7o","Q7o","J7o","T7o","97o","87o","77","76s","75s","74s","73s","72s"],
          ["A6o","K6o","Q6o","J6o","T6o","96o","86o","76o","66","65s","64s","63s","62s"],
          ["A5o","K5o","Q5o","J5o","T5o","95o","85o","75o","65o","55","54s","53s","52s"],
          ["A4o","K4o","Q4o","J4o","T4o","94o","84o","74o","64o","54o","44","43s","42s"],
          ["A3o","K3o","Q3o","J3o","T3o","93o","83o","73o","63o","53o","43o","33","32s"],
          ["A2o","K2o","Q2o","J2o","T2o","92o","82o","72o","62o","52o","42o","32o","22"]
        ];
        this.hands = gridData.flat().map(handStr => ({
          id: handStr,
          name: handStr,
          action: Action.Fold
        }));
      }
    });

    // Marquer les modifications dès qu'il y a un changement dans le formulaire
    this.rangeForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
    });
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      if (this.hasChanges) {
        e.returnValue = true;
      }
    };
  }

  // Découper le tableau plat en grille 2D
  get handsGrid(): Hand[][] {
    const grid = [];
    for (let i = 0; i < this.hands.length; i += this.gridColumns) {
      grid.push(this.hands.slice(i, i + this.gridColumns));
    }
    return grid;
  }

  // Basculer la sélection d'une position via chip
  togglePositionChip(pos: Position) {
    let positions = this.rangeForm.value.positions as Position[];
    if (positions.includes(pos)) {
      positions = positions.filter(p => p !== pos);
    } else {
      positions.push(pos);
    }
    this.rangeForm.patchValue({ positions });
    this.hasChanges = true;
  }

  isPositionSelected(pos: Position): boolean {
    const positions = this.rangeForm.value.positions as Position[];
    return positions.includes(pos);
  }

  // Sélectionner une action depuis la colonne de droite
  selectAction(action: Action) {
    this.selectedAction = action;
  }

  // Appliquer l'action sélectionnée à la cellule cliquée de la grille
  assignAction(cell: Hand) {
    if (this.selectedAction) {
      cell.action = this.selectedAction;
      this.hasChanges = true;
    }
  }

  // Retour à la liste des ranges (route "/range")
  goBack() {
    if (this.hasChanges && !confirm("Vous avez des modifications non sauvegardées. Quitter sans sauvegarder ?")) {
      return;
    }
    this.router.navigate(['/range']);
  }

  // Retourner la couleur associée à une action
  getActionColor(action: Action): string {
    const colorMap: { [key in Action]: string } = {
      [Action.Raise]: "#e79559",
      [Action.RaiseReraise]: "#da6120",
      [Action.RaiseAllIn]: "#ec5221",
      [Action.RaiseCall]: "#e8d15d",
      [Action.RaiseFold]: "#a0793e",
      [Action.Call]: "#52a1de",
      [Action.CallAllIn]: "#7560c5",
      [Action.CallFold]: "#5681b4",
      [Action.Fold]: "#878787",
      [Action.AllIn]: "#f04a39",
    };
    return colorMap[action] || 'transparent';
  }

  // Sauvegarder la range (ajout ou mise à jour)
  saveRange() {
    if (this.rangeForm.invalid || (this.rangeForm.value.positions.length === 0)) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const rangeData: PokerRange = {
      userId: '', // À compléter avec l'ID de l'utilisateur connecté
      name: this.rangeForm.value.name,
      stackDepth: this.rangeForm.value.stackDepth,
      createdAt: new Date(),
      positions: this.rangeForm.value.positions,
      hands: this.hands
    };
    if (this.isEditMode && this.rangeId) {
      this.rangeService.updateRange(this.rangeId, rangeData).then(() => {
        this.hasChanges = false;
        alert("Range mise à jour avec succès !");
        this.router.navigate(['/range']);
      }).catch(err => {
        console.error(err);
        alert("Erreur lors de la mise à jour de la range.");
      });
    } else {
      this.rangeService.addRange(rangeData).then(() => {
        this.hasChanges = false;
        alert("Range sauvegardée avec succès !");
        this.router.navigate(['/range']);
      }).catch(err => {
        console.error(err);
        alert("Erreur lors de la sauvegarde de la range.");
      });
    }
  }

  ngOnDestroy() {
    window.onbeforeunload = null;
  }
}
