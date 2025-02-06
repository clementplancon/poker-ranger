import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { loginGuard } from './services/login.guard';
import { RangeListComponent } from './components/range-list/range-list.component';
import { RangeEditComponent } from './components/range-edit/range-edit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'range', component: RangeListComponent, canActivate: [authGuard] },
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'range/new', component: RangeEditComponent, canActivate: [authGuard] },
    { path: 'range/:id', component: RangeEditComponent, canActivate: [authGuard] },
    // Autres routes éventuelles
    { path: '**', redirectTo: '' }
];
