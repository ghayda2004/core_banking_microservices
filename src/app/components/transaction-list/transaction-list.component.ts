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
        <h1 class="text-4xl font-bold text-white mb-2">Historique des transactions</h1>
        <p class="text-gray-400">Consultez tous vos mouvements bancaires</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input type="text" 
                 placeholder="Rechercher une transaction..." 
                 class="w-full bg-navy-light border border-navy-lighter rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors">
        </div>
        <button class="flex items-center space-x-2 bg-navy-light border border-navy-lighter rounded-xl px-6 py-3 hover:border-blue-500 transition-colors">
          <i-lucide [img]="filterIcon" class="w-5 h-5"></i-lucide>
          <span>Filtrer</span>
        </button>
      </div>

      <!-- Transactions Table - Desktop View -->
      <div class="hidden md:block bg-navy-light rounded-2xl border border-navy-lighter overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-navy-lighter">
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Montant</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Bénéficiaire</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of transactions" class="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-300">
                <div class="flex items-center space-x-2">
                  <i-lucide [img]="calendarIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                  <span>{{ transaction.date | date:'dd/MM/yyyy' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-white">{{ transaction.description }}</td>
              <td class="px-6 py-4 text-sm font-semibold"
                  [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'">
                <div class="flex items-center space-x-1">
                  <i-lucide [img]="transaction.type === 'credit' ? arrowDownIcon : arrowUpIcon" class="w-4 h-4"></i-lucide>
                  <span>{{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} EUR</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300">{{ transaction.recipientName || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm">
                <span [ngClass]="{
                  'bg-green-600/20 text-green-400': transaction.status === 'completed',
                  'bg-yellow-600/20 text-yellow-400': transaction.status === 'pending',
                  'bg-red-600/20 text-red-400': transaction.status === 'failed'
                }" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ transaction.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Transactions List - Mobile View -->
      <div class="md:hidden space-y-4">
        <div *ngFor="let transaction of transactions" 
             class="bg-navy-light rounded-xl p-4 border border-navy-lighter">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <p class="font-semibold text-white mb-1">{{ transaction.description }}</p>
              <p class="text-xs text-gray-400">{{ transaction.date | date:'dd/MM/yyyy' }}</p>
            </div>
            <div class="text-right">
              <p [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'" 
                 class="font-bold">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} EUR
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-navy-lighter">
            <span class="text-xs text-gray-400">{{ transaction.recipientName || 'N/A' }}</span>
            <span [ngClass]="{
              'bg-green-600/20 text-green-400': transaction.status === 'completed',
              'bg-yellow-600/20 text-yellow-400': transaction.status === 'pending',
              'bg-red-600/20 text-red-400': transaction.status === 'failed'
            }" class="px-2 py-1 rounded text-xs font-medium">
              {{ transaction.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center space-x-2 mt-8">
        <button class="px-4 py-2 rounded-lg border border-navy-lighter hover:border-blue-500 transition-colors">Précédent</button>
        <button class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors">1</button>
        <button class="px-4 py-2 rounded-lg border border-navy-lighter hover:border-blue-500 transition-colors">2</button>
        <button class="px-4 py-2 rounded-lg border border-navy-lighter hover:border-blue-500 transition-colors">3</button>
        <button class="px-4 py-2 rounded-lg border border-navy-lighter hover:border-blue-500 transition-colors">Suivant</button>
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
