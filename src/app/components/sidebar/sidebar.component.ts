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
  X 
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="h-screen bg-navy-light border-r border-navy-lighter fixed left-0 top-0 w-64 z-50 transition-transform duration-300" 
         [class.translate-x-0]="isOpen"
         [class.-translate-x-full]="!isOpen">
      
      <!-- Header -->
      <div class="p-6 border-b border-navy-lighter">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-blue-400">BankHub</h1>
          <button (click)="toggleSidebar()" class="md:hidden">
            <i-lucide [img]="closeIcon" class="w-6 h-6"></i-lucide>
          </button>
        </div>
        <div class="text-sm text-gray-400">
          <p class="font-semibold text-white mb-1">Jean Dupont</p>
          <p>Compte Premium</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-6 space-y-2">
        <a routerLink="/dashboard" 
           routerLinkActive="bg-blue-600 text-white"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-lighter transition-colors">
          <i-lucide [img]="homeIcon" class="w-5 h-5"></i-lucide>
          <span>Dashboard</span>
        </a>

        <a routerLink="/transactions" 
           routerLinkActive="bg-blue-600 text-white"
           class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-lighter transition-colors">
          <i-lucide [img]="historyIcon" class="w-5 h-5"></i-lucide>
          <span>Transactions</span>
        </a>

        <a routerLink="/transfer" 
           routerLinkActive="bg-blue-600 text-white"
           class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-lighter transition-colors">
          <i-lucide [img]="sendIcon" class="w-5 h-5"></i-lucide>
          <span>Virement</span>
        </a>

        <a routerLink="/settings" 
           routerLinkActive="bg-blue-600 text-white"
           class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-navy-lighter transition-colors">
          <i-lucide [img]="settingsIcon" class="w-5 h-5"></i-lucide>
          <span>Paramètres</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-navy-lighter">
        <button class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors">
          <i-lucide [img]="logoutIcon" class="w-5 h-5"></i-lucide>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>

    <!-- Overlay mobile -->
    <div *ngIf="isOpen" 
         (click)="toggleSidebar()" 
         class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>
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
  settingsIcon = Settings;
  logoutIcon = LogOut;
  closeIcon = X;
  menuIcon = Menu;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen);
  }
}
