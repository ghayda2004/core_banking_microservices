import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, Transaction } from '../../services/account.service';
import { LucideAngularModule } from 'lucide-angular';
import { ArrowUpRight, ArrowDownLeft, Calendar, Filter } from 'lucide-angular';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-slideInUp">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold gradient-text mb-3">Historique des transactions</h1>
        <p class="text-gray-400 text-lg">Consultez tous vos mouvements bancaires</p>
      </div>

      <!-- Stats Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card rounded-2xl p-5 hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm mb-1">Total reçu</p>
              <p class="text-2xl font-bold text-green-400">+2,650 TND</p>
            </div>
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <i-lucide [img]="arrowDownIcon" class="w-6 h-6 text-green-400"></i-lucide>
            </div>
          </div>
        </div>
        <div class="glass-card rounded-2xl p-5 hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm mb-1">Total envoyé</p>
              <p class="text-2xl font-bold text-red-400">-1,485 TND</p>
            </div>
            <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <i-lucide [img]="arrowUpIcon" class="w-6 h-6 text-red-400"></i-lucide>
            </div>
          </div>
        </div>
        <div class="glass-card rounded-2xl p-5 hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm mb-1">Transactions</p>
              <p class="text-2xl font-bold text-blue-400">{{ transactions.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <i-lucide [img]="calendarIcon" class="w-6 h-6 text-blue-400"></i-lucide>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" 
                   placeholder="Rechercher par description, montant ou bénéficiaire..." 
                   class="w-full input-primary pl-12">
          </div>
          <div class="flex gap-2">
            <button class="flex items-center space-x-2 btn-secondary px-5">
              <i-lucide [img]="filterIcon" class="w-5 h-5"></i-lucide>
              <span>Filtrer</span>
            </button>
            <button class="flex items-center space-x-2 btn-secondary px-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Exporter</span>
            </button>
          </div>
        </div>
        
        <!-- Quick filters -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button class="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium hover:bg-blue-500/30 transition-all">
            Tous
          </button>
          <button class="px-4 py-2 rounded-lg bg-navy-lighter text-gray-300 border border-transparent text-sm font-medium hover:border-blue-500/30 transition-all">
            Reçus
          </button>
          <button class="px-4 py-2 rounded-lg bg-navy-lighter text-gray-300 border border-transparent text-sm font-medium hover:border-blue-500/30 transition-all">
            Envoyés
          </button>
          <button class="px-4 py-2 rounded-lg bg-navy-lighter text-gray-300 border border-transparent text-sm font-medium hover:border-blue-500/30 transition-all">
            En attente
          </button>
        </div>
      </div>

      <!-- Transactions Table - Desktop View -->
      <div class="hidden md:block glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-navy-lighter/50 border-b border-white/10">
              <tr>
                <th class="px-6 py-4 text-left">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-semibold text-gray-300">Date</span>
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Bénéficiaire</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-300">Montant</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">Statut</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let transaction of transactions; let i = index" 
                  class="hover:bg-navy-lighter/50 transition-all group cursor-pointer"
                  [style.animation-delay]="i * 0.05 + 's'">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2 text-gray-300">
                    <div class="p-2 bg-navy-lighter rounded-lg group-hover:bg-navy-lightest transition-colors">
                      <i-lucide [img]="calendarIcon" class="w-4 h-4 text-gray-400"></i-lucide>
                    </div>
                    <span class="text-sm font-medium">{{ transaction.date | date:'dd MMM yyyy' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                         [ngClass]="transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'">
                      <i-lucide [img]="transaction.type === 'credit' ? arrowDownIcon : arrowUpIcon" 
                                class="w-5 h-5"
                                [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'"></i-lucide>
                    </div>
                    <span class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {{ transaction.description }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-400">
                  {{ transaction.recipientName || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-base font-bold"
                        [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'">
                    {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} TND
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span [ngClass]="{
                    'bg-green-500/20 text-green-400 border-green-500/30': transaction.status === 'completed',
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse-slow': transaction.status === 'pending',
                    'bg-red-500/20 text-red-400 border-red-500/30': transaction.status === 'failed'
                  }" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border">
                    <span class="w-1.5 h-1.5 rounded-full mr-2"
                          [ngClass]="{
                            'bg-green-400': transaction.status === 'completed',
                            'bg-yellow-400': transaction.status === 'pending',
                            'bg-red-400': transaction.status === 'failed'
                          }"></span>
                    {{ transaction.status === 'completed' ? 'Complété' : transaction.status === 'pending' ? 'En attente' : 'Échoué' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button class="p-2 hover:bg-blue-500/20 rounded-lg transition-all group/btn">
                    <svg class="w-5 h-5 text-gray-400 group-hover/btn:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transactions List - Mobile View -->
      <div class="md:hidden space-y-3">
        <div *ngFor="let transaction of transactions; let i = index" 
             class="glass-card rounded-2xl p-4 hover-lift cursor-pointer"
             [style.animation-delay]="i * 0.05 + 's'">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3 flex-1">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                   [ngClass]="transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'">
                <i-lucide [img]="transaction.type === 'credit' ? arrowDownIcon : arrowUpIcon" 
                          class="w-5 h-5"
                          [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'"></i-lucide>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-white mb-1">{{ transaction.description }}</p>
                <p class="text-xs text-gray-400">{{ transaction.date | date:'dd MMM yyyy' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'" 
                 class="font-bold text-lg">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} TND
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-white/5">
            <span class="text-xs text-gray-400">{{ transaction.recipientName || 'N/A' }}</span>
            <span [ngClass]="{
              'bg-green-500/20 text-green-400 border-green-500/30': transaction.status === 'completed',
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': transaction.status === 'pending',
              'bg-red-500/20 text-red-400 border-red-500/30': transaction.status === 'failed'
            }" class="px-2.5 py-1 rounded-full text-xs font-semibold border">
              {{ transaction.status === 'completed' ? 'Complété' : transaction.status === 'pending' ? 'En attente' : 'Échoué' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between glass-card rounded-2xl p-4">
        <div class="text-sm text-gray-400">
          Affichage de <span class="text-white font-semibold">1-{{ transactions.length }}</span> sur 
          <span class="text-white font-semibold">{{ transactions.length }}</span> transactions
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-4 py-2 rounded-lg btn-secondary hover:border-blue-500 transition-all disabled:opacity-50" disabled>
            Précédent
          </button>
          <button class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all">
            1
          </button>
          <button class="px-4 py-2 rounded-lg btn-secondary hover:border-blue-500 transition-all">
            2
          </button>
          <button class="px-4 py-2 rounded-lg btn-secondary hover:border-blue-500 transition-all">
            3
          </button>
          <button class="px-4 py-2 rounded-lg btn-secondary hover:border-blue-500 transition-all">
            Suivant
          </button>
        </div>
      </div>
    </div>
  `
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];

  arrowUpIcon = ArrowUpRight;
  arrowDownIcon = ArrowDownLeft;
  calendarIcon = Calendar;
  filterIcon = Filter;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.accountService.getTransactions(20).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
        // Données de démonstration
        this.transactions = [
          {
            id: '1',
            date: '2025-02-14',
            description: 'Virement reçu - Employeur',
            amount: 2500,
            type: 'credit',
            status: 'completed',
            recipientName: 'Acme Corp'
          },
          {
            id: '2',
            date: '2025-02-13',
            description: 'Paiement loyer',
            amount: 1200,
            type: 'debit',
            status: 'completed',
            recipientName: 'Jean Landlord'
          },
          {
            id: '3',
            date: '2025-02-12',
            description: 'Supermarché Carrefour',
            amount: 85.50,
            type: 'debit',
            status: 'completed',
            recipientName: 'Carrefour'
          },
          {
            id: '4',
            date: '2025-02-11',
            description: 'Recharge téléphone',
            amount: 20,
            type: 'debit',
            status: 'pending',
            recipientName: 'Orange'
          },
          {
            id: '5',
            date: '2025-02-10',
            description: 'Remboursement AMI',
            amount: 150,
            type: 'credit',
            status: 'completed',
            recipientName: 'Alice Martin'
          },
          {
            id: '6',
            date: '2025-02-09',
            description: 'Électricité',
            amount: 120,
            type: 'debit',
            status: 'completed',
            recipientName: 'EDF'
          },
          {
            id: '7',
            date: '2025-02-08',
            description: 'Restaurant Le Petit Paris',
            amount: 45,
            type: 'debit',
            status: 'completed',
            recipientName: 'Le Petit Paris'
          },
          {
            id: '8',
            date: '2025-02-07',
            description: 'Abonnement Netflix',
            amount: 15.99,
            type: 'debit',
            status: 'completed',
            recipientName: 'Netflix'
          }
        ];
      }
    });
  }
}
