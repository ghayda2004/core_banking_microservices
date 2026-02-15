import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Home, 
  Send, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Network
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="h-screen glass-card fixed left-0 top-0 w-72 z-50 transition-all duration-300 shadow-2xl md:translate-x-0" 
         [class.translate-x-0]="isOpen"
         [class.-translate-x-full]="!isOpen">
      
      <!-- Header with gradient -->
      <div class="p-6 border-b border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-glow">
              <span class="text-2xl font-bold">B</span>
            </div>
            <h1 class="text-2xl font-bold gradient-text">BankHub</h1>
          </div>
          <button (click)="toggleSidebar()" class="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all">
            <i-lucide [img]="closeIcon" class="w-6 h-6"></i-lucide>
          </button>
        </div>
        
        <!-- User Profile -->
        <div class="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            JD
          </div>
          <div class="flex-1">
            <p class="font-semibold text-white">Jean Dupont</p>
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p class="text-xs text-gray-400">Premium</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 280px);">
        <a routerLink="/dashboard" 
           routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-glow"
           [routerLinkActiveOptions]="{exact: true}"
           class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <i-lucide [img]="homeIcon" class="w-5 h-5 relative z-10"></i-lucide>
          <span class="font-medium relative z-10">Dashboard</span>
        </a>

        <a routerLink="/transactions" 
           routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-glow"
           class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <i-lucide [img]="historyIcon" class="w-5 h-5 relative z-10"></i-lucide>
          <span class="font-medium relative z-10">Transactions</span>
        </a>

        <a routerLink="/transfer" 
           routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-glow"
           class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <i-lucide [img]="sendIcon" class="w-5 h-5 relative z-10"></i-lucide>
          <span class="font-medium relative z-10">Virement</span>
        </a>

        <a routerLink="/architecture" 
           routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-glow"
           class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <i-lucide [img]="networkIcon" class="w-5 h-5 relative z-10"></i-lucide>
          <span class="font-medium relative z-10">Architecture</span>
        </a>

        <a routerLink="/settings" 
           routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-glow"
           class="group flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <i-lucide [img]="settingsIcon" class="w-5 h-5 relative z-10"></i-lucide>
          <span class="font-medium relative z-10">Paramètres</span>
        </a>

        <!-- Quick Actions Section -->
        <div class="pt-4 mt-4 border-t border-white/10">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Actions rapides</p>
          <button class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-green-600/20 text-green-400 hover:text-green-300 transition-all">
            <i-lucide [img]="sendIcon" class="w-4 h-4"></i-lucide>
            <span class="text-sm font-medium">Nouveau virement</span>
          </button>
        </div>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-navy-light/50 backdrop-blur-xl">
        <button class="flex items-center space-x-3 w-full px-4 py-3 rounded-xl hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all group">
          <i-lucide [img]="logoutIcon" class="w-5 h-5 group-hover:scale-110 transition-transform"></i-lucide>
          <span class="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>

    <!-- Overlay mobile with blur -->
    <div *ngIf="isOpen" 
         (click)="toggleSidebar()" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"></div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  
  isOpen = false;
  
  homeIcon = Home;
  sendIcon = Send;
  historyIcon = History;
  networkIcon = Network;
  settingsIcon = Settings;
  logoutIcon = LogOut;
  closeIcon = X;
  menuIcon = Menu;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen);
  }
}
