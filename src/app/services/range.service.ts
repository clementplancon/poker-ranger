import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Hand {
    id: string;
    name: string;
    action: Action;
}

export interface PokerRange {
    id?: string;
    userId: string;
    name: string;
    createdAt: Date;
    positions: Position[];
    stackDepth: StackDepth;
    hands: Hand[];
}

export enum Action {
    Raise = "Raise",
    RaiseReraise = "Raise-reraise",
    RaiseAllIn = "Raise-all-in",
    RaiseCall = "Raise-call",
    RaiseFold = "Raise-fold",
    Call = "Call",
    CallAllIn = "Call-all-in",
    CallFold = "Call-fold",
    Fold = "Fold",
    AllIn = "All-in",
}

export enum Position {
    UTG = "UTG",
    UTG1 = "UTG1",
    MP = "MP",
    MP1 = "MP1",
    HJ = "HJ",
    CO = "CO",
    BTN = "BTN",
    SB = "SB",
    BB = "BB"
}

export enum ActionColor {
    Raise = "#e79559",
    RaiseReraise = "#da6120",
    RaiseAllIn = "#ec5221",
    RaiseCall = "#e8d15d",
    RaiseFold = "#a0793e",
    Call = "#52a1de",
    CallAllIn = "#7560c5",
    CallFold = "#5681b4",
    Fold = "#878787",
    AllIn = "#f04a39",
}

export enum StackDepth {
    VeryShallow = "(0BB - 15BB)",
    Shallow = "(15BB - 25BB)",
    Medium = "(25BB - 40BB)",
    Deep = "(40BB - 60BB)",
    VeryDeep = "(60BB+)",
}

@Injectable({
    providedIn: 'root'
})
export class RangeService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);
    private rangesCollection = collection(this.firestore, 'ranges');

    constructor() {}

    // Ajouter un nouveau range
    async addRange(range: PokerRange) {
        if (!this.auth.currentUser) throw new Error("Utilisateur non connecté");
        range.userId = this.auth.currentUser.uid;
        range.createdAt = new Date();
        return await addDoc(this.rangesCollection, range);
    }

    // Récupérer les ranges de l'utilisateur
    getUserRanges(): Observable<PokerRange[]> {
        if (!this.auth.currentUser) throw new Error("Utilisateur non connecté");
        const q = query(this.rangesCollection, where("userId", "==", this.auth.currentUser.uid));
        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PokerRange))
        );
    }

    // Récupérer une range par son id
    async getRangeById(id: string): Promise<PokerRange> {
      const rangeDocRef = doc(this.firestore, 'ranges', id);
      const rangeSnap = await getDoc(rangeDocRef);
      if (!rangeSnap.exists()) {
        throw new Error('Range non trouvée');
      }
      return { id: rangeSnap.id, ...rangeSnap.data() } as PokerRange;
    }

    // Mettre à jour une range existante
    async updateRange(id: string, data: Partial<PokerRange>): Promise<void> {
      const rangeDocRef = doc(this.firestore, 'ranges', id);
      data.userId = this.auth.currentUser?.uid;
      await updateDoc(rangeDocRef, data);
    }

    // Mettre à jour l'action d'une main
    async updateHandAction(rangeId: string, handId: string, newAction: Action) {
        try {
          const rangeRef = doc(this.firestore, 'ranges', rangeId); // Référence au document Range
    
          // Récupérer le range actuel
          const rangeDoc = await getDoc(rangeRef);
    
          if (rangeDoc.exists()) {
            const rangeData = rangeDoc.data() as PokerRange;
    
            // Mettre à jour l'action de la main dans le tableau des mains
            const updatedHands = rangeData.hands.map((hand) =>
              hand.id === handId ? { ...hand, action: newAction } : hand
            );
    
            // Mettre à jour le document range avec les nouvelles mains
            await updateDoc(rangeRef, { hands: updatedHands });
    
            console.log('Mise à jour réussie des mains');
          } else {
            console.error('Le range n\'existe pas');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la main :', error);
        }
      }

    // Supprimer un range
    async deleteRange(id: string) {
        const rangeRef = doc(this.firestore, 'ranges', id);
        return await deleteDoc(rangeRef);
    }
}