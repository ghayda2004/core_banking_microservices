import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TrendingUp, Eye, EyeOff, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-angular';
import { AccountService, Account, Transaction } from '../../services/account.service';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  template: `
    <div class="space-y-6 animate-slideInUp">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold gradient-text mb-3">Tableau de bord</h1>
        <p class="text-gray-400 text-lg">Bienvenue dans votre espace bancaire</p>
      </div>

      <!-- Balance Card with Glassmorphism -->
      <div class="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl hover-lift group">
        <!-- Animated background gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 opacity-90"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-12">
            <div class="space-y-2">
              <p class="text-blue-100 text-sm font-medium tracking-wide uppercase">Solde total</p>
              <div class="flex items-baseline space-x-4">
                <h2 class="text-6xl font-bold tracking-tight">
                  {{ isBalanceVisible ? (account?.balance | number:'1.2-2') : '••••••' }}
                </h2>
                <span class="text-2xl font-semibold opacity-90">{{ account?.currency || 'TND' }}</span>
              </div>
              <div class="flex items-center space-x-2 mt-4">
                <div class="flex items-center space-x-1 text-green-300 bg-green-400/20 px-3 py-1 rounded-full text-sm">
                  <span>+12.5%</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                </div>
                <span class="text-blue-100 text-sm">vs mois dernier</span>
              </div>
            </div>
            <button (click)="toggleBalanceVisibility()" 
                    class="p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110 backdrop-blur-sm">
              <i-lucide [img]="isBalanceVisible ? eyeIcon : eyeOffIcon" class="w-6 h-6"></i-lucide>
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p class="text-blue-100 text-xs font-medium mb-2 uppercase tracking-wider">Titulaire</p>
              <p class="font-semibold text-lg">{{ account?.accountHolder || 'N/A' }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p class="text-blue-100 text-xs font-medium mb-2 uppercase tracking-wider">Type de compte</p>
              <p class="font-semibold text-lg">{{ account?.accountType || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- IBAN Card -->
      <div class="glass-card rounded-2xl p-6 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-500/20 rounded-xl">
              <i-lucide [img]="creditCardIcon" class="w-5 h-5 text-blue-400"></i-lucide>
            </div>
            <h3 class="text-lg font-semibold">Numéro de RIB</h3>
          </div>
          <button class="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline">
            Copier
          </button>
        </div>
        <p class="text-gray-300 font-mono text-lg break-all bg-navy-lighter/50 p-4 rounded-xl border border-white/5">
          {{ account?.iban || 'Chargement...' }}
        </p>
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-card rounded-2xl p-6 hover-lift group">
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <span class="text-xs text-gray-400 bg-green-500/10 px-2 py-1 rounded-full">+15%</span>
          </div>
          <p class="text-gray-400 text-sm mb-2">Revenus ce mois</p>
          <p class="text-3xl font-bold text-green-400">+2,500 TND</p>
        </div>
        
        <div class="glass-card rounded-2xl p-6 hover-lift group">
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
              </svg>
            </div>
            <span class="text-xs text-gray-400 bg-red-500/10 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p class="text-gray-400 text-sm mb-2">Dépenses ce mois</p>
          <p class="text-3xl font-bold text-red-400">-1,200 TND</p>
        </div>
        
        <div class="glass-card rounded-2xl p-6 hover-lift group">
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-xs text-gray-400 bg-blue-500/10 px-2 py-1 rounded-full">Épargne</span>
          </div>
          <p class="text-gray-400 text-sm mb-2">Solde net</p>
          <p class="text-3xl font-bold text-blue-400">+1,300 TND</p>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="glass-card rounded-2xl p-6 hover-lift">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-500/20 rounded-xl">
              <i-lucide [img]="trendingIcon" class="w-5 h-5 text-blue-400"></i-lucide>
            </div>
            <h3 class="text-lg font-semibold">Activité récente</h3>
          </div>
          <select class="bg-navy-lighter border border-navy-lightest rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
          </select>
        </div>
        <div class="relative h-72 bg-navy-lighter/30 rounded-xl p-4">
          <canvas #chartCanvas></canvas>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">Dernières transactions</h3>
          <a routerLink="/transactions" class="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline">
            Voir tout
          </a>
        </div>
        <div class="space-y-3">
          <div *ngFor="let transaction of recentTransactions; let i = index" 
               class="flex items-center justify-between p-4 bg-navy-lighter/50 rounded-xl hover:bg-navy-lighter transition-all hover-lift cursor-pointer group"
               [style.animation-delay]="i * 0.1 + 's'">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" 
                   [ngClass]="transaction.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                <i-lucide [img]="transaction.type === 'credit' ? arrowDownIcon : arrowUpIcon" class="w-5 h-5"></i-lucide>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {{ transaction.description }}
                </p>
                <p class="text-sm text-gray-400">{{ transaction.date | date:'dd MMM yyyy' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p [ngClass]="transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'" 
                 class="font-bold text-lg">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | number:'1.2-2' }} EUR
              </p>
              <span [ngClass]="{
                'bg-green-500/20 text-green-400 border-green-500/30': transaction.status === 'completed',
                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': transaction.status === 'pending',
                'bg-red-500/20 text-red-400 border-red-500/30': transaction.status === 'failed'
              }" class="text-xs px-2.5 py-1 rounded-full border font-medium">
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
  arrowDownIcon = ArrowDownLeft;
  arrowUpIcon = ArrowUpRight;

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
