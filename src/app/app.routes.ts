import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { SignUp } from './component/sign-up/sign-up';
import { Dashboard } from './component/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: SignUp },
    { path: 'dashboard', component: Dashboard },
];
   
