import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Users, CreditCard, TrendingUp, AlertCircle, Activity } from 'lucide-angular';
import { AdminService, Account, Client, Transaction, AdminStats } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Tableau de Bord Admin</h1>
        <p class="text-gray-400">Supervision du système bancaire</p>
      </div>

      <!-- Health Status -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-green-600/20 border border-green-600 rounded-xl p-4">
          <div class="flex items-center space-x-2 mb-2">
            <i-lucide [img]="activityIcon" class="w-5 h-5 text-green-400"></i-lucide>
            <span class="text-green-400 font-semibold">Services</span>
          </div>
          <p class="text-2xl font-bold text-white">4/4</p>
          <p class="text-xs text-green-300 mt-1">Tous actifs</p>
        </div>

        <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-4">
          <div class="flex items-center space-x-2 mb-2">
            <i-lucide [img]="usersIcon" class="w-5 h-5 text-blue-400"></i-lucide>
            <span class="text-blue-400 font-semibold">Clients</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats?.totalClients || 0 }}</p>
          <p class="text-xs text-blue-300 mt-1">Total actifs</p>
        </div>

        <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
          <div class="flex items-center space-x-2 mb-2">
            <i-lucide [img]="creditCardIcon" class="w-5 h-5 text-purple-400"></i-lucide>
            <span class="text-purple-400 font-semibold">Comptes</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats?.totalAccounts || 0 }}</p>
          <p class="text-xs text-purple-300 mt-1">Solde: {{ stats?.totalBalance || 0 | number:'1.2-2' }} TND</p>
        </div>

        <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
          <div class="flex items-center space-x-2 mb-2">
            <i-lucide [img]="alertIcon" class="w-5 h-5 text-yellow-400"></i-lucide>
            <span class="text-yellow-400 font-semibold">Transactions</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats?.pendingTransactions || 0 }}</p>
          <p class="text-xs text-yellow-300 mt-1">En attente</p>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Transactions Récentes</h2>
          <span class="text-sm text-gray-400">{{ stats?.totalTransactions || 0 }} total</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-navy-lighter">
                <th class="text-left px-4 py-3 text-gray-300">ID</th>
                <th class="text-left px-4 py-3 text-gray-300">Montant (TND)</th>
                <th class="text-left px-4 py-3 text-gray-300">Type</th>
                <th class="text-left px-4 py-3 text-gray-300">Statut</th>
                <th class="text-left px-4 py-3 text-gray-300">Bénéficiaire</th>
                <th class="text-left px-4 py-3 text-gray-300">Date</th>
                <th class="text-left px-4 py-3 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of transactions.slice(0, 10)" 
                  class="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
                <td class="px-4 py-3 font-mono text-xs text-blue-400">{{ transaction.id.substring(0, 8) }}...</td>
                <td class="px-4 py-3 font-semibold text-white">{{ transaction.amount | number:'1.2-2' }}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'">
                    {{ transaction.type === 'credit' ? '+' : '-' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span [ngClass]="{
                    'bg-green-600/20 text-green-400': transaction.status === 'completed',
                    'bg-yellow-600/20 text-yellow-400': transaction.status === 'pending',
                    'bg-red-600/20 text-red-400': transaction.status === 'failed'
                  }" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-300">{{ transaction.toRecipient || 'N/A' }}</td>
                <td class="px-4 py-3 text-gray-400 text-xs">{{ transaction.createdAt | date:'short' }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button *ngIf="transaction.status === 'pending'" 
                            (click)="validateTransaction(transaction.id)"
                            class="px-2 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/40 rounded text-xs transition-colors">
                      Valider
                    </button>
                    <button *ngIf="transaction.status === 'pending'" 
                            (click)="rejectTransaction(transaction.id)"
                            class="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded text-xs transition-colors">
                      Rejeter
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accounts Table -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Gestion des Comptes</h2>
          <span class="text-sm text-gray-400">{{ stats?.activeAccounts }} actifs</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-navy-lighter">
                <th class="text-left px-4 py-3 text-gray-300">Titulaire</th>
                <th class="text-left px-4 py-3 text-gray-300">IBAN</th>
                <th class="text-left px-4 py-3 text-gray-300">Solde (TND)</th>
                <th class="text-left px-4 py-3 text-gray-300">Statut</th>
                <th class="text-left px-4 py-3 text-gray-300">Type</th>
                <th class="text-left px-4 py-3 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let account of accounts" 
                  class="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
                <td class="px-4 py-3 font-semibold text-white">{{ account.accountHolder }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-300">{{ account.iban }}</td>
                <td class="px-4 py-3 font-bold text-white">{{ account.balance | number:'1.2-2' }}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="{
                    'bg-green-600/20 text-green-400': account.status === 'active',
                    'bg-red-600/20 text-red-400': account.status === 'blocked',
                    'bg-gray-600/20 text-gray-400': account.status === 'inactive'
                  }" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ account.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-300">{{ account.accountType }}</td>
                <td class="px-4 py-3">
                  <button *ngIf="account.status === 'active'" 
                          (click)="blockAccount(account.id)"
                          class="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded text-xs transition-colors">
                    Bloquer
                  </button>
                  <button *ngIf="account.status === 'blocked'" 
                          (click)="unblockAccount(account.id)"
                          class="px-2 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/40 rounded text-xs transition-colors">
                    Débloquer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Gestion des Clients</h2>
          <span class="text-sm text-gray-400">{{ clients.length }} clients</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-navy-lighter">
                <th class="text-left px-4 py-3 text-gray-300">Nom</th>
                <th class="text-left px-4 py-3 text-gray-300">Email</th>
                <th class="text-left px-4 py-3 text-gray-300">Téléphone</th>
                <th class="text-left px-4 py-3 text-gray-300">Ville</th>
                <th class="text-left px-4 py-3 text-gray-300">Statut</th>
                <th class="text-left px-4 py-3 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let client of clients" 
                  class="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
                <td class="px-4 py-3 font-semibold text-white">{{ client.firstName }} {{ client.lastName }}</td>
                <td class="px-4 py-3 text-gray-300">{{ client.email }}</td>
                <td class="px-4 py-3 text-gray-300">{{ client.phone }}</td>
                <td class="px-4 py-3 text-gray-300">{{ client.city }}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="{
                    'bg-green-600/20 text-green-400': client.status === 'active',
                    'bg-red-600/20 text-red-400': client.status === 'blocked',
                    'bg-gray-600/20 text-gray-400': client.status === 'inactive'
                  }" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ client.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button *ngIf="client.status === 'active'" 
                          (click)="blockClient(client.id)"
                          class="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded text-xs transition-colors">
                    Bloquer
                  </button>
                  <button *ngIf="client.status === 'blocked'" 
                          (click)="unblockClient(client.id)"
                          class="px-2 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/40 rounded text-xs transition-colors">
                    Débloquer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  accounts: Account[] = [];
  clients: Client[] = [];
  transactions: Transaction[] = [];
  stats: AdminStats | null = null;

  usersIcon = Users;
  creditCardIcon = CreditCard;
  trendingIcon = TrendingUp;
  alertIcon = AlertCircle;
  activityIcon = Activity;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getAllAccounts().subscribe(accounts => {
      this.accounts = accounts;
      this.calculateStats();
    });

    this.adminService.getAllClients().subscribe(clients => {
      this.clients = clients;
    });

    this.adminService.getAllTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.calculateStats();
    });
  }

  calculateStats() {
    if (this.accounts.length > 0 && this.transactions.length > 0) {
      this.stats = this.adminService.calculateStats(
        this.accounts,
        this.clients,
        this.transactions
      );
    }
  }

  validateTransaction(transactionId: string) {
    this.adminService.validateTransaction(transactionId).subscribe(() => {
      this.loadData();
    });
  }

  rejectTransaction(transactionId: string) {
    this.adminService.rejectTransaction(transactionId).subscribe(() => {
      this.loadData();
    });
  }

  blockAccount(accountId: string) {
    this.adminService.blockAccount(accountId).subscribe(() => {
      this.loadData();
    });
  }

  unblockAccount(accountId: string) {
    this.adminService.unblockAccount(accountId).subscribe(() => {
      this.loadData();
    });
  }

  blockClient(clientId: string) {
    this.adminService.blockClient(clientId).subscribe(() => {
      this.loadData();
    });
  }

  unblockClient(clientId: string) {
    this.adminService.unblockClient(clientId).subscribe(() => {
      this.loadData();
    });
  }
}
