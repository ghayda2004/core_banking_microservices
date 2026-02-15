import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { ArchitectureComponent } from './components/architecture/architecture.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'architecture', component: ArchitectureComponent },
  { path: 'settings', component: DashboardComponent }, // Placeholder
];
