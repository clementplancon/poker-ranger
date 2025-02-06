import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);

  goToRanges() {
    this.router.navigate(['/range']);
  }

  goToQuiz() {
    //this.router.navigate(['/quiz']);
  }
}
