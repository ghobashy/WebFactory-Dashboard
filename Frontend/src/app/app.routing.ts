import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'pages/skills', pathMatch: 'full' },
  // { path: '**', redirectTo: 'pages/skills' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
