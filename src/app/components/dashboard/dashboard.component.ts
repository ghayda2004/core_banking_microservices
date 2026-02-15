import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TrendingUp, Eye, EyeOff, CreditCard } from 'lucide-angular';
import { AccountService, Account, Transaction } from '../../services/account.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-slideInUp">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
        <p class="text-gray-400">Bienvenue dans votre compte bancaire</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
        <div class="flex justify-between items-start mb-12">
          <div>
            <p class="text-blue-100 text-sm mb-2">Solde total</p>
            <div class="flex items-baseline space-x-3">
              <h2 class="text-5xl font-bold">{{ isBalanceVisible ? (account?.balance | number:'1.2-2') : '****' }}</h2>
              <span class="text-xl">{{ account?.currency || 'TND' }}</span>
            </div>
          </div>
          <button (click)="toggleBalanceVisibility()" class="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <i-lucide [img]="isBalanceVisible ? eyeIcon : eyeOffIcon" class="w-6 h-6"></i-lucide>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="border-t border-blue-300 pt-4">
            <p class="text-blue-100 text-xs mb-1">Titulaire</p>
            <p class="font-semibold">{{ account?.accountHolder || 'N/A' }}</p>
          </div>
          <div class="border-t border-blue-300 pt-4">
            <p class="text-blue-100 text-xs mb-1">Type de compte</p>
            <p class="font-semibold">{{ account?.accountType || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- IBAN Card -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <div class="flex items-center space-x-3 mb-4">
          <i-lucide [img]="creditCardIcon" class="w-5 h-5 text-blue-400"></i-lucide>
          <h3 class="text-lg font-semibold">Numéro de RIB</h3>
        </div>
        <p class="text-gray-300 font-mono text-lg break-all">{{ account?.iban || 'Chargement...' }}</p>
        <button class="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors">Copier le RIB</button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
          <p class="text-gray-400 text-sm mb-2">Revenus ce mois</p>
          <p class="text-2xl font-bold text-green-400">+2,500 TND</p>
        </div>
        <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
          <p class="text-gray-400 text-sm mb-2">Dépenses ce mois</p>
          <p class="text-2xl font-bold text-red-400">-1,200 TND</p>
        </div>
        <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
          <p class="text-gray-400 text-sm mb-2">Solde net</p>
          <p class="text-2xl font-bold text-blue-400">+1,300 TND</p>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <div class="flex items-center space-x-2 mb-6">
          <i-lucide [img]="trendingIcon" class="w-5 h-5 text-blue-400"></i-lucide>
          <h3 class="text-lg font-semibold">Activité récente</h3>
        </div>
        <div class="relative h-64">
          <canvas #chartCanvas></canvas>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-navy-light rounded-2xl p-6 border border-navy-lighter">
        <h3 class="text-lg font-semibold mb-4">Dernières transactions</h3>
        <div class="space-y-3">
          <div *ngFor="let transaction of recentTransactions" 
               class="flex items-center justify-between p-4 bg-navy-lighter rounded-xl hover:bg-navy-lighter/80 transition-colors">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-10 h-10 rounded-full" 
                   [ngClass]="transaction.type === 'credit' ? 'bg-green-600/20' : 'bg-red-600/20'">
              </div>
              <div>
                <p class="font-semibold">{{ transaction.description }}</p>
                <p class="text-sm text-gray-400">{{ transaction.date | date:'short' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'" 
                 class="font-semibold">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} EUR
              </p>
              <span [ngClass]="{
                'bg-green-600/20 text-green-400': transaction.status === 'completed',
                'bg-yellow-600/20 text-yellow-400': transaction.status === 'pending',
                'bg-red-600/20 text-red-400': transaction.status === 'failed'
              }" class="text-xs px-2 py-1 rounded">
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  account: Account | null = null;
  recentTransactions: Transaction[] = [];
  isBalanceVisible = true;
  chart: Chart | null = null;

  eyeIcon = Eye;
  eyeOffIcon = EyeOff;
  creditCardIcon = CreditCard;
  trendingIcon = TrendingUp;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccountInfo();
    this.loadTransactions();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  loadAccountInfo() {
    this.accountService.getAccountInfo().subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du compte:', error);
        // Données de démonstration
        this.account = {
          id: '1',
          accountNumber: '123456789',
          iban: 'TN5910006035183885671999',
          balance: 15420.50,
          currency: 'TND',
          accountHolder: 'Jean Dupont',
          accountType: 'Compte Courant'
        };
      }
    });
  }

  loadTransactions() {
    this.accountService.getTransactions(5).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
        // Données de démonstration
        this.recentTransactions = [
          {
            id: '1',
            date: '2025-02-14',
            description: 'Virement reçu - Employeur',
            amount: 2500,
            type: 'credit',
            status: 'completed'
          },
          {
            id: '2',
            date: '2025-02-13',
            description: 'Paiement loyer',
            amount: 1200,
            type: 'debit',
            status: 'completed'
          },
          {
            id: '3',
            date: '2025-02-12',
            description: 'Supermarché Carrefour',
            amount: 85.50,
            type: 'debit',
            status: 'completed'
          },
          {
            id: '4',
            date: '2025-02-11',
            description: 'Recharge téléphone',
            amount: 20,
            type: 'debit',
            status: 'pending'
          },
          {
            id: '5',
            date: '2025-02-10',
            description: 'Remboursement AMI',
            amount: 150,
            type: 'credit',
            status: 'completed'
          }
        ];
      }
    });
  }

  initChart() {
    if (!this.chartCanvas) return;
    
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Solde',
            data: [15000, 15200, 15150, 15300, 15450, 15400, 15420],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#999',
            },
            grid: {
              color: '#333',
            }
          },
          x: {
            ticks: {
              color: '#999',
            },
            grid: {
              display: false,
            }
          }
        }
      }
    });
  }

  toggleBalanceVisibility() {
    this.isBalanceVisible = !this.isBalanceVisible;
  }
}
